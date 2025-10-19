# Инструкция по добавлению поля image в таблицу products

## Вариант 1: Добавление поля (Рекомендуется)

Если таблица `products` уже создана и содержит данные, используйте скрипт `add_image_field.sql`:

```sql
-- Выполните в Neon Console:
-- 1. Откройте SQL Editor
-- 2. Скопируйте и выполните код из add_image_field.sql
```

Этот скрипт:
- Добавляет поле `image` в существующую таблицу
- Устанавливает значения по умолчанию для существующих записей
- Обновляет записи с реальными путями к изображениям

## Вариант 2: Пересоздание таблицы

Если таблица пустая или вы хотите начать с нуля, используйте `recreate_products_table.sql`:

```sql
-- ВНИМАНИЕ: Удалит все существующие данные!
-- Выполните в Neon Console:
-- 1. Откройте SQL Editor
-- 2. Скопируйте и выполните код из recreate_products_table.sql
```

## После выполнения любого скрипта:

1. **Проверьте структуру таблицы:**
```sql
\d products
```

2. **Проверьте данные:**
```sql
SELECT id, name, image FROM products;
```

3. **Обновите данные, если нужно:**
```sql
-- Если нужно изменить изображения
UPDATE products SET image = '/images/new_image.jpg' WHERE id = 1;
```

## Проверка работы:

После выполнения скрипта:
1. Перезапустите Next.js приложение: `npm run dev`
2. Откройте каталог товаров
3. Проверьте, что изображения отображаются корректно

## Возможные проблемы:

1. **Ошибка "column does not exist"** - поле уже добавлено
2. **Ошибка "NOT NULL constraint"** - не все записи имеют изображения
3. **Изображения не отображаются** - проверьте пути к файлам в папке `public/images/`

## Структура после изменений:

```sql
products:
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- short_description (TEXT)
- full_description (TEXT)
- materials (TEXT)
- production_time (VARCHAR)
- price (DECIMAL)
- discount (INTEGER)
- discounted_price (DECIMAL)
- image (VARCHAR) -- НОВОЕ ПОЛЕ
- category_id (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```
