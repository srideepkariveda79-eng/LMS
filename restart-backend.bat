@echo off
echo Starting Backend (NestJS)...
cd /d %~dp0backend-nest
node_modules\.bin\nest start --watch
