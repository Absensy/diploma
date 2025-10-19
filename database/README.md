# База данных Granit

## Настройка PostgreSQL с Neon

### 1. Создание базы данных в Neon

1. Перейдите на [Neon Console](https://console.neon.tech/)
2. Создайте новый проект
3. Скопируйте строку подключения (Connection String)

### 2. Установка зависимостей

```bash
npm install pg @types/pg
```

### 3. Настройка переменных окружения

Создайте файл `.env.local`:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
```

### 4. Создание таблиц

Выполните SQL из файла `schema.sql` в вашей базе данных Neon.

### 5. Заполнение данными

Выполните SQL из файла `seed.sql` для добавления начальных данных.

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

## Использование в Next.js

Создайте файл `lib/db.ts` для подключения к базе данных:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```
