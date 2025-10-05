# PowerShell script to build the Electron app
Write-Host "Building Jolly Children Academic Center..." -ForegroundColor Green

# Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "build") { Remove-Item -Recurse -Force "build" }

# Build React app
Write-Host "Building React application..." -ForegroundColor Yellow
npm run build

# Build Electron app with disabled code signing
Write-Host "Building Electron application..." -ForegroundColor Yellow
$env:ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = "true"
npm run electron-pack-simple

Write-Host "Build complete! Check the 'dist' folder for the installer." -ForegroundColor Green
