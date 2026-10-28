#!/usr/bin/env python3
"""Build dist/trianon.html (one self-contained file) from src/.  Usage: python3 build.py
Requires Python 3.9+, Pillow, fontTools, uharfbuzz (see requirements.txt)."""
import os, sys, runpy
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
os.environ.setdefault('TRIANON_OUT', os.path.join(ROOT, 'dist', 'trianon.html'))
os.chdir(SRC)
sys.path.insert(0, SRC)
runpy.run_path(os.path.join(SRC, 'build_rococo_v2.py'), run_name='__main__')
