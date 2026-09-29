#!/usr/bin/env python3
"""
Master 5-Tab Excel Workbook Generator.
--------------------------------------
Constructs the comprehensive `.xlsx` workbook containing:
- Tab 1: All Evidence & Sources
- Tab 2: Node-Paper Mappings
- Tab 3: GNN Chemical & Atom Features (DGL-LifeSci & RDKit compatible)
- Tab 4: Single-Cell & Causal Dynamics (FANTOM4, OmniPath, Recon3D, MeSH, RNAInter)
- Tab 5: Hallucination Verification Audit (Provenance cross-validation)
"""

import sys
import json
import zipfile
import xml.sax.saxutils
from pathlib import Path

def escape_xml(val):
    if val is None:
        return ""
    if isinstance(val, (list, dict)):
        val = json.dumps(val)
    s = str(val)
    s = "".join(c for c in s if c in ('\t', '\n', '\r') or (ord(c) >= 32 and ord(c) != 127))
    return xml.sax.saxutils.escape(s)

def build_worksheet_xml(headers, rows):
    out = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ',
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\n',
        '  <sheetViews><sheetView tabSelected="1" workbookViewId="0"/></sheetViews>\n',
        '  <sheetFormatPr defaultRowHeight="16"/>\n',
        '  <sheetData>\n'
    ]

    # Header row
    out.append('    <row r="1" spans="1:{}">\n'.format(len(headers)))
    for col_idx, h in enumerate(headers, 1):
        col_letter = chr(64 + col_idx) if col_idx <= 26 else f"A{chr(64 + col_idx - 26)}"
        ref = f"{col_letter}1"
        out.append(f'      <c r="{ref}" t="inlineStr"><is><t>{escape_xml(h)}</t></is></c>\n')
    out.append('    </row>\n')

    # Data rows
    for row_idx, r in enumerate(rows, 2):
        out.append(f'    <row r="{row_idx}" spans="1:{len(headers)}">\n')
        for col_idx, val in enumerate(r, 1):
            col_letter = chr(64 + col_idx) if col_idx <= 26 else f"A{chr(64 + col_idx - 26)}"
            ref = f"{col_letter}{row_idx}"
            out.append(f'      <c r="{ref}" t="inlineStr"><is><t>{escape_xml(val)}</t></is></c>\n')
        out.append('    </row>\n')

    out.append('  </sheetData>\n</worksheet>')
    return "".join(out)

def create_master_xlsx(output_path, tabs):
    """Creates a multi-tab Excel workbook from a list of tab dicts:
       [{'name': str, 'headers': list, 'rows': list}, ...]
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    num_sheets = len(tabs)

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        def put(name, content):
            info = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, content)
        # [Content_Types].xml
        types_lines = [
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
            '  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
            '  <Default Extension="xml" ContentType="application/xml"/>',
            '  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        ]
        for i in range(1, num_sheets + 1):
            types_lines.append(f'  <Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
        types_lines.append('</Types>')
        put('[Content_Types].xml', "\n".join(types_lines))

        # _rels/.rels
        put('_rels/.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>''')

        # xl/_rels/workbook.xml.rels
        wb_rels_lines = [
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        ]
        for i in range(1, num_sheets + 1):
            wb_rels_lines.append(f'  <Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>')
        wb_rels_lines.append('</Relationships>')
        put('xl/_rels/workbook.xml.rels', "\n".join(wb_rels_lines))

        # xl/workbook.xml
        wb_sheets_lines = [
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
            '  <sheets>'
        ]
        for i, tab in enumerate(tabs, 1):
            wb_sheets_lines.append(f'    <sheet name="{escape_xml(tab["name"])}" sheetId="{i}" r:id="rId{i}"/>')
        wb_sheets_lines.append('  </sheets>')
        wb_sheets_lines.append('</workbook>')
        put('xl/workbook.xml', "\n".join(wb_sheets_lines))

        # Write individual worksheets
        for i, tab in enumerate(tabs, 1):
            put(f'xl/worksheets/sheet{i}.xml', build_worksheet_xml(tab["headers"], tab["rows"]))

    print(f"Generated {num_sheets}-Tab Master Excel Workbook: {output_path} ({output_path.stat().st_size:,} bytes)")

create_5tab_xlsx = create_master_xlsx

print("Master XLSX generator module initialized.")
