@echo off
echo ===================================================
echo   🐳 LAUNCHING DOCKER MICROSERVICES PLATFORM
echo ===================================================
echo.
echo 1. Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

echo Waiting for Docker daemon to initialize...
:wait_docker
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 >nul
    goto wait_docker
)

echo.
echo 2. Running docker-compose up...
docker compose up --build
pause
