#!/bin/bash

echo "🚀 Настройка Cloudinary для проекта Granit Memory"
echo "=================================================="

# Проверяем наличие .env.local
if [ ! -f ".env.local" ]; then
    echo "📝 Создаем файл .env.local..."
    cp env.example .env.local
fi

echo ""
echo "📋 Инструкция по получению API ключей Cloudinary:"
echo ""
echo "1. Перейдите на https://cloudinary.com"
echo "2. Зарегистрируйтесь или войдите в аккаунт"
echo "3. В Dashboard найдите раздел 'API Keys'"
echo "4. Нажмите 'Reveal' рядом с API Secret"
echo "5. Скопируйте значения:"
echo "   - Cloud Name"
echo "   - API Key" 
echo "   - API Secret"
echo ""

read -p "Введите Cloud Name: " CLOUD_NAME
read -p "Введите API Key: " API_KEY
read -p "Введите API Secret: " API_SECRET

# Обновляем .env.local
echo "🔧 Обновляем переменные окружения..."

# Создаем временный файл с обновленными переменными
cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/granit_memory"

# Cloud Storage Configuration
CLOUD_STORAGE_PROVIDER=cloudinary

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${CLOUD_NAME}
CLOUDINARY_API_KEY=${API_KEY}
CLOUDINARY_API_SECRET=${API_SECRET}
EOF

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "📁 Переменные сохранены в .env.local:"
echo "   CLOUD_STORAGE_PROVIDER=cloudinary"
echo "   CLOUDINARY_CLOUD_NAME=${CLOUD_NAME}"
echo "   CLOUDINARY_API_KEY=${API_KEY}"
echo "   CLOUDINARY_API_SECRET=***скрыто***"
echo ""
echo "🔄 Перезапустите приложение для применения изменений:"
echo "   npm run dev"
echo ""
echo "🎉 Теперь изображения будут загружаться в Cloudinary!"
