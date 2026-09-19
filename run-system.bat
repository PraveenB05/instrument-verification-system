@echo off
title SIH26036 - Online Weighing & Measuring Verification System Launcher
echo ===================================================================
echo  Starting SIH26036 Verification System (Backend + Frontend)
echo ===================================================================
echo.

set "ROOT_DIR=%~dp0"

echo [1/2] Launching Spring Boot Backend on http://localhost:8080...
start "SIH Verification Backend" cmd /k "cd /d %ROOT_DIR%backend && mvnw.cmd spring-boot:run"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo [2/2] Launching React Frontend on http://localhost:5173...
start "SIH Verification Frontend" cmd /k "cd /d %ROOT_DIR%frontend && npm.cmd run dev"

echo.
echo ===================================================================
echo Both Backend and Frontend have been launched in separate windows!
echo Open your browser at: http://localhost:5173
echo ===================================================================
pause
