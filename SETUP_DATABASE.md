# Настройка базы данных для проекта Granit

## 1. Создание базы данных в Neon

1. Перейдите на [Neon Console](https://console.neon.tech/)
2. Создайте новый проект
3. Скопируйте строку подключения (Connection String)

## 2. Установка зависимостей

```bash
npm install
```

## 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
```

Замените на вашу реальную строку подключения из Neon.

## 4. Создание таблиц

1. Откройте SQL Editor в Neon Console
2. Скопируйте и выполните код из файла `database/schema.sql`
3. Проверьте, что таблицы созданы

## 5. Заполнение данными

1. В том же SQL Editor выполните код из файла `database/seed.sql`
2. Проверьте, что данные добавлены

## 6. Проверка работы

Запустите проект:

```bash
npm run dev
```

Проверьте API эндпоинты:
- `http://localhost:3000/api/categories` - список категорий
- `http://localhost:3000/api/products` - список товаров
- `http://localhost:3000/api/contact` - контактная информация

## Структура базы данных

### Таблица `categories`
- `id` - Уникальный идентификатор
- `name` - Название категории
- `price_from` - Стоимость от
- `photo` - Путь к фотографии
- `discount` - Скидка в процентах (опционально)
- `discounted_price` - Цена со скидкой (опционально)

### Таблица `products`
- `id` - Уникальный идентификатор
- `name` - Название товара
- `short_description` - Краткое описание
- `full_description` - Полное описание
- `materials` - Материалы
- `production_time` - Сроки изготовления
- `price` - Цена
- `discount` - Скидка в процентах (опционально)
- `discounted_price` - Цена со скидкой (опционально)
- `category_id` - Ссылка на категорию

### Таблица `contact_info`
- `id` - Уникальный идентификатор
- `address` - Адрес
- `phone` - Телефон
- `email` - Почта
- `instagram` - Инстаграм (опционально)
- `working_hours` - Время работы

## API Эндпоинты

### GET /api/categories
Получить все категории

### POST /api/categories
Создать новую категорию

### GET /api/products?category_id=1
Получить все товары (с фильтром по категории)

### POST /api/products
Создать новый товар

### GET /api/contact
Получить контактную информацию

### PUT /api/contact
Обновить контактную информацию
