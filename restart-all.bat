@echo off
echo Starting all services...

start "Backend" cmd /k "cd /d %~dp0backend-nest && node_modules\.bin\nest start --watch"
timeout /t 4 /nobreak >nul

start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
start "Admin" cmd /k "cd /d %~dp0admin && npm run dev"

echo All services started.
