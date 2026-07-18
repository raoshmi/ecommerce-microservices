@echo off
echo ===================================================
echo   🚀 STARTING ALL E-COMMERCE MICROSERVICES
echo ===================================================
echo.
set "JAVA_HOME=C:\Users\User\.jdks\corretto-17.0.19"
set "PATH=C:\Users\User\.jdks\corretto-17.0.19\bin;%PATH%"
set "MVN_CMD=C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.3\plugins\maven\lib\maven3\bin\mvn.cmd"
cd /d "%~dp0"

echo 1. Starting Config Server (Port 8888)...
start "Config Server" /min cmd /c "cd config-server && call "%MVN_CMD%" spring-boot:run"
ping 127.0.0.1 -n 12 >nul

echo 2. Starting Eureka Server (Port 8761)...
start "Eureka Server" /min cmd /c "cd eureka-server && call "%MVN_CMD%" spring-boot:run"
ping 127.0.0.1 -n 10 >nul

echo 3. Starting User Service (Port 8081)...
start "User Service" /min cmd /c "cd user-service && call "%MVN_CMD%" spring-boot:run"

echo 4. Starting Product Service (Port 8082)...
start "Product Service" /min cmd /c "cd product-service && call "%MVN_CMD%" spring-boot:run"

echo 5. Starting Cart Service (Port 8083)...
start "Cart Service" /min cmd /c "cd cart-service && call "%MVN_CMD%" spring-boot:run"

echo 6. Starting Order Service (Port 8084)...
start "Order Service" /min cmd /c "cd order-service && call "%MVN_CMD%" spring-boot:run"

echo 7. Starting Inventory Service (Port 8085)...
start "Inventory Service" /min cmd /c "cd inventory-service && call "%MVN_CMD%" spring-boot:run"

echo 8. Starting Payment Service (Port 8086)...
start "Payment Service" /min cmd /c "cd payment-service && call "%MVN_CMD%" spring-boot:run"

echo 9. Starting Notification Service (Port 8087)...
start "Notification Service" /min cmd /c "cd notification-service && call "%MVN_CMD%" spring-boot:run"

ping 127.0.0.1 -n 5 >nul
echo 10. Starting API Gateway (Port 8080)...

start "API Gateway" /min cmd /c "cd api-gateway && call "%MVN_CMD%" spring-boot:run"

echo.
echo ===================================================
echo   🎉 ALL SERVICES ARE BOOTING UP IN THE BACKGROUND!
echo   Please wait 15-20 seconds, then open:
echo   👉 Eureka Dashboard: http://localhost:8761
echo   👉 Frontend App: http://localhost:3000
echo ===================================================
pause
