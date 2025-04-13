@echo off
REM === Script para ejecutar ZK Sync Service en modo x86 con Swagger habilitado ===

REM Establece el entorno de desarrollo
set ASPNETCORE_ENVIRONMENT=Development

REM Ruta al ejecutable (ajusta si lo moviste)
set SERVICE_DIR=H:\hsb-microservicios\backend\services\zk-sync-service\bin\Release\net9.0\win-x86\publish

REM Ir al directorio
cd /d %SERVICE_DIR%

REM Ejecutar el servicio
start zk-sync-service.exe

REM Darle unos segundos para levantar el servidor
timeout /t 3 >nul

REM Abrir Swagger UI automáticamente
start http://localhost:5000/swagger
