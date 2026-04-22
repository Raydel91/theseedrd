@echo off
chcp 65001 >nul
title SuperCasas — listado + fotos
cd /d "%~dp0..\.."

echo.
echo === Vivienda RD: listado + fotos (SuperCasas) ===
echo Carpeta de salida: housing-export (en la raíz del proyecto)
echo.

if not exist "tools\housing-scraper\node_modules" (
  echo Instalando dependencias del scraper...
  call npm install --prefix tools\housing-scraper
  if errorlevel 1 goto :err
)

echo Ejecutando: Punta Cana, venta, hasta 10 anuncios, fotos incluidas...
echo.
call npx --prefix tools\housing-scraper tsx tools\housing-scraper\src\cli.ts --photos --out-dir ./housing-export -n 10 --pages 2 -r punta-cana -k sale
if errorlevel 1 goto :err

echo.
echo Abriendo carpeta y la galería en el navegador...
start "" "%cd%\housing-export"
start "" "%cd%\housing-export\galeria.html"
echo.
echo Listo. Puedes cerrar esta ventana.
pause
goto :eof

:err
echo.
echo Hubo un error. Revisa la conexión y vuelve a intentar.
pause
exit /b 1
