@echo off
setlocal

REM Ajustar para buscar en solo una carpeta SDK
set "DLL_PATH=%~dp0\zkemkeeper.dll"

echo ========================================
echo REGISTRAR ZKEMKEEPER.DLL (Windows 11)
echo ========================================
echo Buscando DLL en: %DLL_PATH%
echo.

if not exist "%DLL_PATH%" (
    echo ERROR: No se encontro el archivo zkemkeeper.dll
    pause
    exit /b 1
)

echo Registrando en regsvr32 (64-bit)...
"C:\Windows\System32\regsvr32.exe" "%DLL_PATH%"
echo Resultado del registro 64-bit: %ERRORLEVEL%
echo.

echo Registrando en regsvr32 (32-bit)...
"C:\Windows\SysWow64\regsvr32.exe" "%DLL_PATH%"
echo Resultado del registro 32-bit: %ERRORLEVEL%
echo.

echo Listo. Si hubo errores, verificalos arriba.
pause
