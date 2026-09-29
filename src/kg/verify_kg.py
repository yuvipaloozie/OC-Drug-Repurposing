"""Compatibility entry point for structural validation."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from src.kg.validate_schema import run_verification, main
if __name__=="__main__":main()
