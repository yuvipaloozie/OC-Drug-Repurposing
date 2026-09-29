/* Shared, dependency-free UI. All scientific values are read from the snapshot. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const mode = document.body.dataset.mode;
  const data = window.OC_GRAPH;
  const nodes = new Map(data.nodes.map(n => [n.id, n]));
  const incident = new Map(data.nodes.map(n => [n.id, []]));
  data.edges.forEach(e => { incident.get(e.source)?.push(e); if (e.source !== e.target) incident.get(e.target)?.push(e); });
  const human = v => String(v || 'Not recorded').replace(/_/g, ' ');
  const symbol = n => n.symbol || (n.id.startsWith('HGNC:') ? n.id.slice(5) : n.name) || n.id;
  const colors = {rna:'#d2a019',protein:'#47ad85', enzyme:'#e76560', transcription_factor:'#247f99', gene:'#bb8139', intracellular_compound:'#c79b22', extracellular_compound:'#a27a40', reaction:'#5b929e', pathway:'#478d70'};
  const visualType=n=>n.roles?.includes('enzyme')?'enzyme':n.roles?.includes('transcription_factor')?'transcription_factor':n.type;
  const color = n => colors[visualType(n)] || '#718596';
  const fills={protein:'#edf7f1',enzyme:'#fcefed',transcription_factor:'#edf5f8',rna:'#fff8e3',gene:'#fbf2e7',intracellular_compound:'#f9f5e5',extracellular_compound:'#f8f1e7',reaction:'#eff5f5',pathway:'#eef5ed'};
  const resolveNode=id=>nodes.get(id)||data.nodes.find(n=>n.legacy_ids?.includes(id));
  const entityType=n=>n.type==='rna'?`${({mrna:'mRNA',mirna:'miRNA',lncrna:'lncRNA'})[n.rna_type]||human(n.rna_type)} · RNA`:n.roles?.length?`${human(n.roles.join(', '))} · protein`:human(n.type);
  const make = (tag, text, cls) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; };
  const selectedParam = new URLSearchParams(location.search).get('node');
  let selected = resolveNode(selectedParam) || resolveNode(mode === 'graph' ? 'HGNC:PHGDH' : 'HGNC:SRC') || data.nodes[0];
  let lastNodeClick = null;
  let scope = 'module', rootId = selected.id, animation = 0, neighborPage = 0, viewNodes = [], viewEdges = [], positions = new Map();
  let scale = 1, panX = 0, panY = 0, drag = null, moved = false, structureOptions = [], modelViewer = null, loadSerial = 0, loadController = null, libraryPromise;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs, text) => { const e = document.createElementNS(svgNS, tag); Object.entries(attrs || {}).forEach(([k,v]) => e.setAttribute(k,v)); if (text !== undefined) e.textContent = text; return e; };
  document.querySelector(`[data-nav="${mode}"]`).setAttribute('aria-current','page');
  $('page-description').textContent = mode === 'graph' ? 'Choose a target to explore its neighborhood. Drag nodes to arrange the graph; double-click a node to explore its connections.' : 'Inspect a single molecule’s shape. Browse experimental structures and predicted protein models.';
  $('total-nodes').textContent = data.nodes.length;
  const modules = [...new Set(data.nodes.map(n => n.physiological_pillar).filter(Boolean))].sort();
  modules.forEach(m => { const option = make('option',human(m)); option.value = m; $('module').append(option); });
  function renderCatalog() {
    const q = $('search').value.toLowerCase().trim(), module = $('module').value;
    const found = data.nodes.filter(n => (module === 'all' || n.physiological_pillar === module) && [n.id,n.name,n.symbol,...(n.legacy_ids||[]),...(Array.isArray(n.aliases) ? n.aliases : [n.aliases || ''])].join(' ').toLowerCase().includes(q)).sort((a,b) => symbol(a).localeCompare(symbol(b)));
    $('result-count').textContent = found.length;
    $('entity-list').replaceChildren();
    if (!found.length) $('entity-list').append(make('p','No matching entities. Try another name or choose All modules.','no-results'));
    found.forEach(n => {
      const button = make('button',undefined,'entity-row'); button.setAttribute('aria-pressed',String(n.id === selected.id)); button.setAttribute('aria-label',`Select ${symbol(n)}`); button.title = n.name;
      const dot = make('span',undefined,'dot'); dot.style.setProperty('--node-color', color(n));
      const copy = make('span',undefined,'row-copy'); copy.append(make('strong',symbol(n)),make('small',symbol(n)===n.name?n.id:n.name));
      button.append(dot,copy,make('span',incident.get(n.id).length,'degree')); button.onclick = () => openNeighborhood(n); $('entity-list').append(button);
    });
  }
  function facts(n) {
    $('entity-facts').replaceChildren();
    for (const [key,value] of [['Identifier',n.id],['Entity class',entityType(n)],['Identity status',human(n.identity_status)],['Module',human(n.physiological_pillar)],['Species in KG',human(n.taxon)],['Compartment',human(n.compartment)]]) {
      const row = make('div'); row.append(make('dt',key),make('dd',value)); $('entity-facts').append(row);
    }
    $('raw-annotations').textContent = JSON.stringify(n, (key,value) => ['x','y','vx','vy','styling'].includes(key) ? undefined : value, 2);
  }
  function connections(n) {
    const list = incident.get(n.id); $('connection-count').textContent = list.length; $('connections').replaceChildren();
    if (!list.length) $('connections').append(make('p','No relationships recorded for this entity.','muted'));
    list.forEach(e => {
      const other = nodes.get(e.source === n.id ? e.target : e.source), detail = make('details',undefined,'connection');
      const summary = make('summary',`${e.target === n.id ? '← ' : '→ '}${symbol(other)}`); summary.append(make('span',`${human(e.relation)} · ${e.sign === -1 ? 'negative' : e.sign === 1 ? 'positive' : 'unsigned'}`)); detail.append(summary);
      detail.append(make('p',`Claim status: ${human(e.status)}. ${e.review_note||''}`));
      const evidenceRows=Array.isArray(e.evidence)?e.evidence:[];
      for(const ev of evidenceRows){
        const record=make('div',undefined,'evidence-record');
        record.append(make('strong',`${human(ev.curator_status)} · ${human(ev.passage_status)}`));
        record.append(make('p',ev.quote_or_location||ev.claim_summary||'No source passage or claim summary recorded.'));
        if(!ev.quote_or_location)record.append(make('p','Legacy claim summary only — not a verified passage.'));
        const source=data.sources?.find(s=>s.source_id===ev.source_id);
        record.append(make('p',`Source: ${ev.source_id||'Unresolved'}${source?.title?' — '+source.title:''}`));
        record.append(make('p',`Source check: ${human(source?.claim_match_status)} · Experiment: ${ev.experiment_id||'Not linked'}`));
        record.append(make('p',ev.source_location||ev.review_note||'Source location missing.'));
        const href=ev.source_url||source?.url;
        if(href&&/^https:\/\//.test(href)){const a=make('a','Open source ↗','evidence-link');a.href=href;a.target='_blank';a.rel='noopener noreferrer';record.append(a);}
        detail.append(record);
      }
      const button = make('button',`Explore ${symbol(other)}`,'neighbor-link'); button.onclick = () => openNeighborhood(other); detail.append(button); $('connections').append(detail);
    });
  }
  function openNeighborhood(n) {
    if(mode!=='graph'){select(n);return;}
    scope='neighbors'; rootId=n.id;
    ['neighbors','module'].forEach(t=>$(`scope-${t}`).setAttribute('aria-pressed',String(t===scope)));
    select(n); fitGraph(); animateNeighborhood();
  }
  function animateNeighborhood(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    cancelAnimationFrame(animation);
    const target=new Map([...positions].map(([id,p])=>[id,{...p}]));
    const center=target.get(rootId)||{x:0,y:0}; const start=performance.now();
    function frame(now){
      const t=Math.min(1,(now-start)/420),ease=1-Math.pow(1-t,3);
      for(const [id,p] of positions){const end=target.get(id);p.x=center.x+(end.x-center.x)*(.65+.35*ease);p.y=center.y+(end.y-center.y)*(.65+.35*ease);}
      updateGeometry();if(t<1)animation=requestAnimationFrame(frame);else fitGraph();
    }
    animation=requestAnimationFrame(frame);
  }
  function edgePath(e){
    const a=positions.get(e.source),b=positions.get(e.target),W=176,H=66;
    if(e.source===e.target)return `M${a.x+W} ${a.y+20} C${a.x+W+65} ${a.y-55},${a.x+W/2} ${a.y-55},${a.x+W/2} ${a.y}`;
    const dx=b.x-a.x,dy=b.y-a.y,t=Math.min((W/2+3)/(Math.abs(dx)||.001),(H/2+3)/(Math.abs(dy)||.001));
    const x1=a.x+W/2+dx*t,y1=a.y+H/2+dy*t,x2=b.x+W/2-dx*t,y2=b.y+H/2-dy*t;
    return `M${x1} ${y1} Q${(x1+x2)/2-dy*.045} ${(y1+y2)/2+dx*.045} ${x2} ${y2}`;
  }
  function updateGeometry(){
    document.querySelectorAll('.graph-node').forEach(g=>{const p=positions.get(g.dataset.id);g.setAttribute('transform',`translate(${p.x} ${p.y})`);});
    document.querySelectorAll('.graph-edge').forEach((g,i)=>g.setAttribute('d',edgePath(viewEdges[i])));
  }
  function select(n) {
    selected = n;
    neighborPage = 0;
    const url = new URL(location.href); url.searchParams.set('node',n.id); history.replaceState(null,'',url);
    $('entity-title').textContent = symbol(n); $('entity-name').textContent = n.name; $('entity-type').textContent = entityType(n);
    $('stage-title').textContent = mode === 'graph' ? `${symbol(n)} neighborhood` : symbol(n);
    $('stage-kicker').textContent = mode === 'graph' ? 'BIOLOGICAL RELATIONSHIPS' : 'MOLECULAR STRUCTURE';
    $('stage-badge').textContent = mode === 'graph' ? '2D relationship map' : entityType(n);
    $('cross-link').href = `${mode === 'graph' ? 'osteoclast_3d_conformation_explorer.html' : 'index.html'}?node=${encodeURIComponent(n.id)}`;
    $('cross-link').textContent = mode === 'graph' ? 'Inspect molecular structure →' : 'Explore biological relationships →';
    facts(n); connections(n); renderCatalog();
    if (mode === 'graph') { drawGraph(); } else configureStructure();
  }
  function layoutNetwork() {
    const ordered=[...data.nodes].sort((a,b)=>a.id.localeCompare(b.id));
    const points=ordered.map((n,i)=>({id:n.id,x:Math.cos(i*2.399963)*Math.sqrt(i+1)*145,y:Math.sin(i*2.399963)*Math.sqrt(i+1)*100}));
    const lookup=new Map(points.map(p=>[p.id,p]));
    const links=[...new Map(data.edges.filter(e=>e.source!==e.target).map(e=>[[e.source,e.target].sort().join('|'),e])).values()];
    for(let step=0;step<260;step++) {
      const forces=new Map(points.map(p=>[p.id,{x:-p.x*.002,y:-p.y*.002}]));
      for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
        const a=points[i],b=points[j],dx=b.x-a.x||.01,dy=b.y-a.y||.01,d2=dx*dx+dy*dy,d=Math.sqrt(d2),f=Math.min(18,16000/d2);
        const fa=forces.get(a.id),fb=forces.get(b.id);fa.x-=dx/d*f;fa.y-=dy/d*f;fb.x+=dx/d*f;fb.y+=dy/d*f;
      }
      for(const e of links){const a=lookup.get(e.source),b=lookup.get(e.target),dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,f=(d-260)*.035;const fa=forces.get(a.id),fb=forces.get(b.id);fa.x+=dx/d*f;fa.y+=dy/d*f;fb.x-=dx/d*f;fb.y-=dy/d*f;}
      const cooling=1-step/320;
      for(const p of points){const f=forces.get(p.id);p.x+=Math.max(-22,Math.min(22,f.x))*cooling;p.y+=Math.max(-22,Math.min(22,f.y))*cooling;}
      // Rectangular collision resolution includes space around both labels and cards.
      separate(points);
    }
    for(let i=0;i<1500;i++)if(!separate(points))break;
    for(const p of points){p.x*=3.6;p.y*=1.55;}
    return lookup;
  }
  function separate(points){
    let overlaps=0;
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
      const a=points[i],b=points[j],dx=b.x-a.x,dy=b.y-a.y,ox=214-Math.abs(dx),oy=104-Math.abs(dy);
      if(ox>0&&oy>0){overlaps++;if(ox<oy){const shift=(ox+.1)/2*(dx>=0?1:-1);a.x-=shift;b.x+=shift;}else{const shift=(oy+.1)/2*(dy>=0?1:-1);a.y-=shift;b.y+=shift;}}
    }
    return overlaps;
  }
  const networkPositions=mode==='graph'?layoutNetwork():new Map();
  function drawGraph() {
    cancelAnimationFrame(animation);
    const previous=positions;
    let ids;
    const allNeighbors = [...new Set(incident.get(rootId).flatMap(e=>[e.source,e.target]))].filter(id=>id!==rootId).sort((a,b)=>symbol(nodes.get(a)).localeCompare(symbol(nodes.get(b))));
    if (scope === 'neighbors') ids = new Set([rootId,...allNeighbors]);
    else { const module = $('module').value; ids = new Set(data.nodes.filter(n => module === 'all' || n.physiological_pillar === module).map(n => n.id)); }
    $('neighbor-pagination').hidden = true;
    viewNodes = data.nodes.filter(n => ids.has(n.id));
    viewEdges = data.edges.filter(e => ids.has(e.source) && ids.has(e.target));
    $('stage-title').textContent = scope === 'neighbors' ? `${symbol(nodes.get(rootId))} neighborhood` : $('module').value === 'all' ? 'Full collection' : human($('module').value);
    $('graph-count').textContent = `${viewNodes.length} entities · ${viewEdges.length} relationships`;
    const scene = $('graph-scene'); scene.replaceChildren();
    positions = new Map(viewNodes.map(n => [n.id, {...networkPositions.get(n.id)}]));
    if(scope==='neighbors'){
      positions.set(rootId,{x:0,y:0});
      const radius=Math.max(240,allNeighbors.length*40);
      allNeighbors.forEach((id,i)=>{const angle=-Math.PI/2+i*Math.PI*2/allNeighbors.length;positions.set(id,{x:Math.cos(angle)*radius,y:Math.sin(angle)*radius*.72});});
      for(let i=0;i<300;i++)if(!separate([...positions.values()]))break;
    }
    // Clicking a canvas node inspects it without losing a hand-arranged layout.
    if(previous.size===positions.size&&[...positions.keys()].every(id=>previous.has(id))){positions=previous;}
    const W = 176, H = 66;
    viewEdges.forEach(e => {
      const a = positions.get(e.source), b = positions.get(e.target); if (!a || !b) return;
      const positive = e.sign === 1, negative = e.sign === -1, type = negative ? 'negative' : positive ? 'positive' : 'unknown';
      const active=e.source===selected.id||e.target===selected.id;
      const d=edgePath(e);
      const path = svgEl('path',{class:'graph-edge',d,fill:'none',stroke:negative?'#dd7772':positive?'#549984':'#939e98','stroke-width':active?2:1,opacity:active?.85:.24,'vector-effect':'non-scaling-stroke','marker-end':`url(#arrow-${type})`});
      if (!positive && !negative) path.setAttribute('stroke-dasharray','5 4');
      path.append(svgEl('title',{},`${symbol(nodes.get(e.source))} → ${symbol(nodes.get(e.target))}: ${human(e.relation)}`)); scene.append(path);
    });
    viewNodes.forEach(n => {
      const p = positions.get(n.id), active=n.id===selected.id;
      const group=svgEl('g',{class:'graph-node','data-id':n.id,transform:`translate(${p.x} ${p.y})`,tabindex:0,role:'button','aria-label':`Inspect ${symbol(n)}`});
      group.append(svgEl('rect',{width:W,height:H,rx:9,fill:active?'#e1f0f5':(fills[visualType(n)]||'#edf2f5'),stroke:active?'#217e98':'#cfdad1','stroke-width':active?2:1}));
      group.append(svgEl('rect',{x:11,y:14,width:8,height:8,rx:0,fill:color(n)}));
      const label = symbol(n); let cut=19;if(label.length>19){const space=label.lastIndexOf(' ',19);if(space>9)cut=space;}const firstLine=label.slice(0,cut);
      group.append(svgEl('text',{x:23,y:24,'font-size':13,'font-weight':650,fill:'#293b30'},firstLine));
      if(label.length>19)group.append(svgEl('text',{x:13,y:40,'font-size':11,'font-weight':550,fill:'#293b30'},label.length>cut+24?label.slice(cut,cut+22).trim()+'…':label.slice(cut).trim()));
      group.append(svgEl('text',{x:13,y:56,'font-size':9,fill:'#65796b'},entityType(n)));
      group.append(svgEl('title',{},`${n.name} (${n.id})`));
      group.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.stopPropagation();moved=false;cancelAnimationFrame(animation);const p=positions.get(n.id);drag={id:n.id,x:e.clientX,y:e.clientY,nx:p.x,ny:p.y};});
      group.addEventListener('click',() => {if(moved)return;const now=performance.now();if(lastNodeClick?.id===n.id&&now-lastNodeClick.time<450){lastNodeClick=null;openNeighborhood(n);}else{lastNodeClick={id:n.id,time:now};select(n);}}); group.addEventListener('keydown',e => {if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();cancelAnimationFrame(animation);const p=positions.get(n.id);p.x+=e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0;p.y+=e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0;updateGeometry();return;}if(e.key==='Enter'||e.key===' '){e.preventDefault();if(e.shiftKey)openNeighborhood(n);else select(n);}}); scene.append(group);
    });
    $('graph-empty').hidden = viewNodes.length > 0; $('graph-empty').textContent = 'No entities in this view.';
  }
  function updateTransform(){ $('graph-scene').setAttribute('transform',`translate(${panX} ${panY}) scale(${scale})`); $('zoom-label').textContent=`${Math.round(scale*100)}%`; }
  function fitGraph(){
    if(!positions.size)return; const box=$('graph-frame').getBoundingClientRect(); const ps=[...positions.values()];
    const minX=Math.min(...ps.map(p=>p.x))-20,minY=Math.min(...ps.map(p=>p.y))-45,maxX=Math.max(...ps.map(p=>p.x))+196,maxY=Math.max(...ps.map(p=>p.y))+85;
    scale=Math.min(1.15,(box.width-28)/(maxX-minX),(box.height-25)/(maxY-minY)); scale=Math.max(.01,scale);
    panX=(box.width-(maxX-minX)*scale)/2-minX*scale; panY=(box.height-(maxY-minY)*scale)/2-minY*scale;updateTransform();
  }
  function zoom(factor,x,y){const rect=$('graph-frame').getBoundingClientRect();x=x??rect.width/2;y=y??rect.height/2;const next=Math.min(2.5,Math.max(.01,scale*factor));panX=x-(x-panX)*next/scale;panY=y-(y-panY)*next/scale;scale=next;updateTransform();}
  function configureStructure(){
    resetModel();
    structureOptions=[];
    const candidates=selected.structure_candidates||{};
    const uniprot=String(candidates.uniprot_id||'');
    // Syntax is only an eligibility check; it is not a registry or identity verification.
    if (/^(?:[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9](?:[A-Z][A-Z0-9]{2}[0-9]){1,2})$/.test(uniprot)) structureOptions.push({label:`AlphaFold · ${uniprot}`,url:`https://alphafold.ebi.ac.uk/entry/${uniprot}`,kind:'alphafold',id:uniprot});
    const pdbs=[...new Set([...(Array.isArray(candidates.pdb_structures)?candidates.pdb_structures:[]),candidates.primary_pdb].filter(p=>/^[1-9][a-zA-Z0-9]{3}$/.test(p||'')))];
    pdbs.forEach(p=>structureOptions.push({label:`PDB · ${p}`,url:`https://www.rcsb.org/structure/${p}`,kind:'pdb',id:p}));
    $('structure-source').replaceChildren();
    structureOptions.forEach((o,i)=>{const opt=make('option',o.label);opt.value=i;$('structure-source').append(opt);});
    if(!structureOptions.length){const opt=make('option','No usable structure identifier');$('structure-source').append(opt);}
    $('structure-source').disabled=structureOptions.length<2;
    const sourceNote=$('structure-source-note');sourceNote.hidden=mode!=='structure';
    sourceNote.textContent=structureOptions.length===1
      ? `One candidate recorded: ${structureOptions[0].label}. ${pdbs.length?'No other usable identifier is recorded.':'No usable PDB identifier is recorded.'} Select Load 3D structure; the entity/species mapping is unverified.`
      : structureOptions.length>1
        ? `${structureOptions.length} candidates recorded. Choose a source, then select Load 3D structure. Entity/species mappings are unverified.`
        : 'No usable structure identifier is recorded. Placeholder IDs are excluded.'; $('load-structure').disabled=!structureOptions.length;
    $('structure-message').textContent=structureOptions.length?'Explore this molecule in 3D':'No protein structure available';
    $('structure-explanation').textContent=structureOptions.length?'Choose a source above, then load the interactive structure. Drag to rotate and scroll to zoom. Structure downloads require internet access.':'The repository has no usable AlphaFold or PDB identifier for this entity. RNA, genes, metabolites, reactions and pathways are not protein entities.';
    $('structure-status').textContent=structureOptions.length?'Unverified legacy structure identifiers. Source identity/species may differ from this KG entity; these are candidates, not validated mappings.':'No substitute structure has been loaded.';
    $('external-structure').hidden=!structureOptions.length;
    if(structureOptions.length)$('external-structure').href=structureOptions[0].url;
    else $('external-structure').removeAttribute('href');
  }
  $('search').addEventListener('input',renderCatalog);
  $('module').addEventListener('change',()=>{renderCatalog();if(mode==='graph'&&scope==='module'){drawGraph();fitGraph();}});
  ['neighbors','module'].forEach(s=>$(`scope-${s}`).onclick=()=>{scope=s;if(s==='neighbors')rootId=selected.id;positions=new Map();['neighbors','module'].forEach(t=>$(`scope-${t}`).setAttribute('aria-pressed',String(t===s)));drawGraph();fitGraph();});
  $('previous-neighbors').onclick=()=>{neighborPage=Math.max(0,neighborPage-1);drawGraph();fitGraph();};
  $('next-neighbors').onclick=()=>{neighborPage++;drawGraph();fitGraph();};
  $('zoom-in').onclick=()=>zoom(1.25);$('zoom-out').onclick=()=>zoom(.8);$('fit').onclick=fitGraph;
  $('expand-graph').onclick=()=>{const expanded=document.body.classList.toggle('graph-expanded');$('expand-graph').textContent=expanded?'Restore panels':'Expand';$('expand-graph').setAttribute('aria-pressed',String(expanded));};
  $('actual').onclick=()=>{scale=1;const p=positions.get(selected.id)||[...positions.values()][0];if(p){const r=$('graph-frame').getBoundingClientRect();panX=r.width/2-p.x-78;panY=r.height/2-p.y-27;}updateTransform();};
  $('graph').addEventListener('wheel',e=>{e.preventDefault();const r=$('graph').getBoundingClientRect();zoom(e.deltaY<0?1.12:1/1.12,e.clientX-r.left,e.clientY-r.top);},{passive:false});
  $('graph').addEventListener('pointerdown',e=>{if(e.button!==0)return;moved=false;cancelAnimationFrame(animation);const node=e.target.closest('.graph-node');const p=node?positions.get(node.dataset.id):null;drag={x:e.clientX,y:e.clientY,px:panX,py:panY,id:node?.dataset.id,nx:p?.x,ny:p?.y};});
  window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)moved=true;if(moved){if(drag.id){const p=positions.get(drag.id);p.x=drag.nx+dx/scale;p.y=drag.ny+dy/scale;updateGeometry();}else{panX=drag.px+dx;panY=drag.py+dy;updateTransform();}}});
  window.addEventListener('pointerup',()=>{drag=null;});window.addEventListener('pointercancel',()=>{drag=null;});
  function resetModel(){loadSerial++;loadController?.abort();modelViewer?.clear();$('structure-frame').hidden=true;$('structure-placeholder').hidden=false;$('reset-structure').disabled=true;$('load-structure').textContent='Load 3D structure';}
  function loadLibrary(){
    if(window.$3Dmol)return Promise.resolve();
    if(!libraryPromise)libraryPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='assets/vendor/3Dmol-min.js';script.onload=resolve;script.onerror=()=>{libraryPromise=null;script.remove();reject(new Error('The 3D rendering library could not load.'));};document.head.append(script);});
    return libraryPromise;
  }
  $('structure-source').onchange=()=>{const option=structureOptions[Number($('structure-source').value)];if(option){resetModel();$('external-structure').href=option.url;$('load-structure').disabled=false;$('structure-message').textContent='Explore this molecule in 3D';$('structure-explanation').textContent='Load the selected structure to rotate and zoom its molecular shape.';$('structure-status').textContent=`${option.label} selected. Select Load 3D structure to update the panel. Mapping remains unverified.`;}};
  $('load-structure').onclick=async()=>{
    const option=structureOptions[Number($('structure-source').value)];if(!option)return;
    resetModel();const serial=loadSerial;const controller=new AbortController();loadController=controller;const signal=controller.signal;const timeout=setTimeout(()=>controller.abort(),25000);
    $('load-structure').disabled=true;$('load-structure').textContent='Loading…';$('structure-message').textContent='Loading molecular coordinates';$('structure-explanation').textContent='Retrieving the selected structure from its source.';
    try{
      await loadLibrary();if(serial!==loadSerial)return;
      let pdbUrl=`https://files.rcsb.org/download/${encodeURIComponent(option.id)}.pdb`,description=`PDB ${option.id} · Experimental coordinates. Check source for molecule and species.`;
      if(option.kind==='alphafold'){
        const response=await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${encodeURIComponent(option.id)}`,{signal});if(!response.ok)throw new Error('No AlphaFold model could be retrieved for this identifier.');
        const entries=await response.json(),entry=entries.find(e=>e.uniprotAccession===option.id);
        if(!entry?.pdbUrl)throw new Error('The source did not provide molecular coordinates.');
        const safeUrl=new URL(entry.pdbUrl);if(safeUrl.protocol!=='https:'||safeUrl.hostname!=='alphafold.ebi.ac.uk')throw new Error('Unexpected coordinate source.');
        pdbUrl=safeUrl.href;description=`${entry.organismScientificName||'Species not provided'} · ${entry.uniprotDescription||option.id} · AlphaFold predicted model`;
      }
      const response=await fetch(pdbUrl,{signal});if(!response.ok)throw new Error('The coordinate file could not be retrieved.');const pdb=await response.text();if(serial!==loadSerial)return;
      $('structure-frame').hidden=false;
      if(!modelViewer)modelViewer=window.$3Dmol.createViewer($('structure-frame'),{backgroundColor:'#f8fbfc',antialias:true});
      modelViewer.clear();const model=modelViewer.addModel(pdb,'pdb');const atomCount=model.selectedAtoms({}).length;if(!atomCount)throw new Error('No atoms were found in this coordinate file.');
      modelViewer.setStyle({},{cartoon:{color:'#419b91'}});modelViewer.setStyle({hetflag:true},{stick:{radius:.15,colorscheme:'Jmol'}});modelViewer.resize();modelViewer.zoomTo();modelViewer.render();
      $('structure-placeholder').hidden=true;$('reset-structure').disabled=false;$('structure-status').textContent=`${description} · ${atomCount.toLocaleString()} atoms. Drag to rotate; scroll to zoom.`;
    }catch(error){if(serial!==loadSerial)return;$('structure-frame').hidden=true;$('structure-placeholder').hidden=false;$('structure-message').textContent='Structure could not be loaded';$('structure-explanation').textContent=error.name==='AbortError'?'The source request timed out. Try again or open the source record.':`${error.message} Try again or use Open source.`;$('structure-status').textContent='No model displayed. A source link is available above.';}
    finally{clearTimeout(timeout);if(serial===loadSerial){$('load-structure').disabled=false;$('load-structure').textContent='Load 3D structure';}}
  };
  $('reset-structure').onclick=()=>{if(modelViewer){modelViewer.zoomTo();modelViewer.render();}};
  if(mode==='structure')['structure-tools','structure-stage','structure-footer'].forEach(id=>$(id).hidden=false);
  new ResizeObserver(()=>{if(mode==='graph')fitGraph();}).observe($('graph-frame'));
  new ResizeObserver(()=>{if(modelViewer&&!$('structure-frame').hidden){modelViewer.resize();modelViewer.render();}}).observe($('structure-stage'));
  if(mode==='graph'&&selectedParam)openNeighborhood(selected);else{select(selected);if(mode==='graph')fitGraph();}
})();
