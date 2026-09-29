"""Compatibility entry point. Rebuild audited exports; no synthetic enrichment."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from src.kg.rebuild import rebuild
if __name__=="__main__": rebuild()
