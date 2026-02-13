# Гранит Памяти - Сайт ритуальных услуг

Современный веб-сайт для компании "Гранит Памяти", специализирующейся на изготовлении памятников и ритуальных услуг.

## 🚀 Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - типизация
- **Material-UI** - UI компоненты
- **Prisma** - ORM для работы с БД
- **PostgreSQL** - база данных
- **Cloudinary** - облачное хранение изображений
- **JWT** - аутентификация

## 📋 Функциональность

### Публичная часть
- Главная страница с информацией о компании
- Каталог памятников с фильтрацией
- Примеры работ
- Контактная информация
- Адаптивный дизайн

### Админ-панель
- Управление товарами и категориями
- Загрузка изображений
- Управление контентными блоками
- Управление примерами работ
- Безопасная JWT аутентификация

## 🛠️ Установка и запуск

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd granit
```

### 2. Установка зависимостей
⚠️ **Важно**: Из-за конфликтов зависимостей используйте флаг `--legacy-peer-deps`:

```bash
npm install --legacy-peer-deps
```

### 3. Настройка переменных окружения
Создайте файл `.env.local` в корне проекта:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/granit_memory"

# Cloud Storage Configuration
CLOUD_STORAGE_PROVIDER=local  # local, cloudinary

# Cloudinary (рекомендуется для продакшена)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Admin Panel Password
ADMIN_PASSWORD=Oleshuki2012
```

### 4. Настройка базы данных
```bash
# Создание миграций
npx prisma migrate dev

# Заполнение тестовыми данными
npx prisma db seed
```

### 5. Запуск проекта
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🔐 Доступ к админ-панели

- **URL**: `http://localhost:3000/admin`
- **Пароль**: настраивается через переменную окружения `ADMIN_PASSWORD` (по умолчанию: `Oleshuki2012`)

## 📁 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Админ-панель
│   ├── api/               # API routes
│   └── catalog/           # Каталог товаров
├── components/            # React компоненты
├── hooks/                 # Кастомные хуки
├── lib/                   # Утилиты и конфигурация
├── contexts/              # React контексты
└── types/                 # TypeScript типы
```

## 🚀 Деплой

### Vercel (рекомендуется)
1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой происходит автоматически

### Другие платформы
Следуйте инструкциям в [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

## 📚 Дополнительная документация

- [Настройка базы данных](./SETUP_DATABASE.md)
- [Настройка Cloudinary](./CLOUDINARY_SETUP.md)
- [Деплой в продакшен](./PRODUCTION_DEPLOYMENT.md)
- [Настройка Prisma](./PRISMA_SETUP.md)

## 🤝 Разработка

### Полезные команды
```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен сборки
npm start

# Линтинг
npm run lint

# Проверка типов
npm run type-check
```

### Структура коммитов
- `feat:` - новая функциональность
- `fix:` - исправление багов
- `docs:` - обновление документации
- `style:` - форматирование кода
- `refactor:` - рефакторинг
- `test:` - добавление тестов

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](./LICENSE) для деталей.
