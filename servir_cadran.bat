@echo off
REM Regenere les livres puis sert la demo sur http://localhost:8040
cd /d "%~dp0"
python generate.py
start "" http://localhost:8040/
cd public
python -m http.server 8040
