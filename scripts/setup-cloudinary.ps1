# PowerShell скрипт для настройки Cloudinary
# Запустите: .\scripts\setup-cloudinary.ps1

Write-Host "🚀 Настройка Cloudinary для проекта Granit Memory" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Проверяем наличие .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Создаем файл .env.local..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env.local"
}

Write-Host ""
Write-Host "📋 Инструкция по получению API ключей Cloudinary:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Перейдите на https://cloudinary.com" -ForegroundColor White
Write-Host "2. Зарегистрируйтесь или войдите в аккаунт" -ForegroundColor White
Write-Host "3. В Dashboard найдите раздел 'API Keys'" -ForegroundColor White
Write-Host "4. Нажмите 'Reveal' рядом с API Secret" -ForegroundColor White
Write-Host "5. Скопируйте значения:" -ForegroundColor White
Write-Host "   - Cloud Name" -ForegroundColor Gray
Write-Host "   - API Key" -ForegroundColor Gray
Write-Host "   - API Secret" -ForegroundColor Gray
Write-Host ""

$CLOUD_NAME = Read-Host "Введите Cloud Name"
$API_KEY = Read-Host "Введите API Key"
$API_SECRET = Read-Host "Введите API Secret"

# Обновляем .env.local
Write-Host "🔧 Обновляем переменные окружения..." -ForegroundColor Yellow

$envContent = @"
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/granit_memory"

# Cloud Storage Configuration
CLOUD_STORAGE_PROVIDER=cloudinary

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=$CLOUD_NAME
CLOUDINARY_API_KEY=$API_KEY
CLOUDINARY_API_SECRET=$API_SECRET
"@

Set-Content -Path ".env.local" -Value $envContent

Write-Host ""
Write-Host "✅ Настройка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Переменные сохранены в .env.local:" -ForegroundColor Cyan
Write-Host "   CLOUD_STORAGE_PROVIDER=cloudinary" -ForegroundColor White
Write-Host "   CLOUDINARY_CLOUD_NAME=$CLOUD_NAME" -ForegroundColor White
Write-Host "   CLOUDINARY_API_KEY=$API_KEY" -ForegroundColor White
Write-Host "   CLOUDINARY_API_SECRET=***скрыто***" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Перезапустите приложение для применения изменений:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Теперь изображения будут загружаться в Cloudinary!" -ForegroundColor Green
