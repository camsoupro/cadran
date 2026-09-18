@echo off
cd /d "%~dp0"
echo Trois directions de design pour Cadran.
echo Ouvre http://localhost:8090/ dans le navigateur.
start "" http://localhost:8090/
python -m http.server 8090
