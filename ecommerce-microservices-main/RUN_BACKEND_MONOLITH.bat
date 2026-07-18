@echo off
echo ===================================================
echo   🚀 RUNNING STANDALONE BACKEND MONOLITH (Port 8080)
echo ===================================================
echo.
set "JAVA_HOME=C:\Users\User\.jdks\corretto-17.0.19"
set "PATH=C:\Users\User\.jdks\corretto-17.0.19\bin;%PATH%"
cd /d "%~dp0"

cd unified-backend
call "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.3\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
pause
