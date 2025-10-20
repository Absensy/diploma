# 🔑 Получение API ключей для Cloudinary

## 📸 Пошаговая инструкция с скриншотами

### **Шаг 1: Регистрация на Cloudinary**
1. Перейдите на [cloudinary.com](https://cloudinary.com)
2. Нажмите **"Sign Up For Free"** в правом верхнем углу
3. Заполните форму:
   - Email
   - Пароль
   - Имя
   - Компания (опционально)

### **Шаг 2: Вход в Dashboard**
1. После регистрации вы автоматически попадете в Dashboard
2. Если нет - войдите через **"Log In"**

### **Шаг 3: Поиск API ключей**
1. В Dashboard найдите карточку **"API Keys"**
2. Она находится в правом верхнем углу
3. Вы увидите:
   ```
   Cloud Name: your_cloud_name
   API Key: 123456789012345
   API Secret: [Reveal]
   ```

### **Шаг 4: Получение API Secret**
1. Нажмите кнопку **"Reveal"** рядом с API Secret
2. Скопируйте появившийся ключ
3. ⚠️ **Важно**: Сохраните ключ в безопасном месте!

### **Шаг 5: Копирование всех ключей**
Скопируйте все три значения:
```
Cloud Name: your_cloud_name
API Key: 123456789012345  
API Secret: your_secret_key_here
```

## 🚀 Быстрая настройка

### **Для Windows (PowerShell):**
```powershell
.\scripts\setup-cloudinary.ps1
```

### **Для Linux/Mac (Bash):**
```bash
chmod +x scripts/setup-cloudinary.sh
./scripts/setup-cloudinary.sh
```

### **Ручная настройка:**
1. Создайте файл `.env.local` в корне проекта
2. Добавьте переменные:
```bash
CLOUD_STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret_key_here
```

## 🔒 Безопасность

### **⚠️ Важные правила:**
- ❌ **НЕ** коммитьте `.env.local` в Git
- ❌ **НЕ** делитесь API Secret с другими
- ✅ Используйте разные ключи для dev/prod
- ✅ Регулярно ротируйте ключи

### **📁 Структура файлов:**
```
.env.local          # Локальные переменные (НЕ коммитить)
.env.example        # Пример переменных (можно коммитить)
.gitignore         # Должен содержать .env.local
```

## 🎯 Проверка настройки

### **Тест загрузки:**
1. Запустите приложение: `npm run dev`
2. Перейдите в админ-панель
3. Попробуйте загрузить изображение
4. Проверьте в Cloudinary Dashboard - файл должен появиться

### **Логи для отладки:**
```bash
# В консоли браузера должны появиться:
✅ File uploaded successfully
✅ URL: https://res.cloudinary.com/your_cloud/image/upload/...
```

## 🆘 Решение проблем

### **Ошибка "Invalid API credentials":**
- Проверьте правильность Cloud Name
- Убедитесь, что API Key и Secret скопированы полностью
- Проверьте отсутствие пробелов в начале/конце

### **Ошибка "Upload failed":**
- Проверьте интернет-соединение
- Убедитесь, что файл не превышает 5MB
- Проверьте формат файла (JPEG, PNG, WebP)

### **Файлы не появляются в Cloudinary:**
- Проверьте переменные окружения
- Перезапустите приложение
- Проверьте логи в консоли браузера

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте [документацию Cloudinary](https://cloudinary.com/documentation)
2. Обратитесь в [поддержку Cloudinary](https://support.cloudinary.com)
3. Проверьте [статус сервиса](https://status.cloudinary.com)
