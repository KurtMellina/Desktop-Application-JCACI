@echo off
echo Building Jolly Children Academic Center with Administrator privileges...
echo.

echo Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"
if exist "build" rmdir /s /q "build"

echo.
echo Building React application...
npm run build

echo.
echo Building Electron application...
npm run electron-pack-simple

echo.
echo Build complete! Check the 'dist' folder for the installer.
pause
