@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "LOCAL_MVN=%SCRIPT_DIR%..\tools\apache-maven-3.9.6\bin\mvn.cmd"

if exist "%LOCAL_MVN%" (
    call "%LOCAL_MVN%" %*
) else (
    mvn %*
)
