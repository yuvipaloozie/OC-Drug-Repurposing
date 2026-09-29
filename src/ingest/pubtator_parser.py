"""
PubTator 3.0 ingestion and parser module.
Extracts biomedical entities, text spans, and passage locations from PubTator 3.0 BioC-JSON.
Converts extracted candidate relations to the draft 5-table schema for triage and curation.
"""

from typing import Dict, List, Any, Optional
import json


class PubTatorParser:
    """Parses PubTator 3.0 BioC-JSON responses."""

    @staticmethod
    def parse_bioc_json(data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Parses BioC-JSON structure from PubTator 3.0 API.
        Extracts papers, annotated entities (Gene, Chemical, Disease, CellLine),
        and candidate text passages.
        """
        extracted_papers = []
        docs = data.get("PubTator3", [])
        if not docs and "documents" in data:
            docs = data["documents"]

        for doc in docs:
            pmid = str(doc.get("id", ""))
            passages = doc.get("passages", [])
            title = ""
            abstract = ""
            entities = []

            for p in passages:
                infons = p.get("infons", {})
                p_type = infons.get("type", "")
                text = p.get("text", "")
                if p_type == "title":
                    title = text
                elif p_type == "abstract":
                    abstract = text

                # Extract annotated entities
                for ann in p.get("annotations", []):
                    ann_infons = ann.get("infons", {})
                    entities.append(
                        {
                            "text": ann.get("text", ""),
                            "type": ann_infons.get("type", ""),
                            "identifier": ann_infons.get("identifier", ""),
                            "offset": ann.get("locations", [{}])[0].get("offset", 0),
                            "length": ann.get("locations", [{}])[0].get("length", 0),
                            "passage_type": p_type,
                        }
                    )

            extracted_papers.append(
                {
                    "pmid": pmid,
                    "title": title,
                    "abstract": abstract,
                    "entity_count": len(entities),
                    "entities": entities,
                }
            )

        return extracted_papers

    @staticmethod
    def draft_claim_row(
        source_id: str,
        relation: str,
        target_id: str,
        sign: int,
        context_id: str,
        paper_id: str,
        passage_text: str,
        claim_index: int = 1,
    ) -> Dict[str, Any]:
        """Formats an extracted claim into the edge + evidence format with 'proposed' status."""
        edge_id = f"claim:{paper_id.replace('PMID:', '')}:{claim_index:03d}"
        return {
            "edge": {
                "edge_id": edge_id,
                "source_id": source_id,
                "relation": relation,
                "target_id": target_id,
                "sign": sign,
                "context_id": context_id,
                "source_db": "pubtator3",
                "source_record_id": paper_id,
                "status": "proposed",
            },
            "evidence": {
                "edge_id": edge_id,
                "experiment_id": None,  # Filled upon experimental validation
                "quote_or_location": passage_text,
                "evidence_kind": "association",
                "polarity": "support",
                "curator_status": "automated_extraction",
                "reviewed_at": "",
                "passage_status": "automated_extraction_unreviewed",
                "source_id": paper_id,
                "source_location": "",
                "source_sha256": "",
            },
        }
