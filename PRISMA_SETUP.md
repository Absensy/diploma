# Настройка Prisma для проекта Granit

## Что установлено:

### 1. **Prisma ORM**
- `prisma` - CLI для работы с базой данных
- `@prisma/client` - TypeScript клиент для работы с БД
- `tsx` - для выполнения TypeScript файлов

### 2. **Схема базы данных** (`prisma/schema.prisma`)
- Модели: `Category`, `Product`, `ContactInfo`
- Связи между таблицами
- Типы данных и ограничения

### 3. **Prisma клиент** (`src/lib/prisma.ts`)
- Singleton для подключения к БД
- Оптимизация для production

### 4. **API роуты обновлены**
- Используют Prisma вместо raw SQL
- Type-safe запросы
- Автоматическая валидация

## Команды для работы с базой данных:

### Основные команды:
```bash
# Синхронизация схемы с БД
npm run db:push

# Генерация Prisma клиента
npm run db:generate

# Заполнение БД тестовыми данными
npm run db:seed
```

### Дополнительные команды:
```bash
# Просмотр данных в БД
npx prisma studio

# Создание миграции
npx prisma migrate dev --name init

# Сброс БД
npx prisma migrate reset
```

## Структура базы данных:

### Category (Категории)
```typescript
{
  id: number
  name: string
  price_from: Decimal
  photo: string
  discount?: number
  discounted_price?: Decimal
  created_at: DateTime
  updated_at: DateTime
  products: Product[]
}
```

### Product (Товары)
```typescript
{
  id: number
  name: string
  short_description: string
  full_description: string
  materials: string
  production_time: string
  price: Decimal
  discount?: number
  discounted_price?: Decimal
  image: string
  category_id?: number
  created_at: DateTime
  updated_at: DateTime
  category?: Category
}
```

### ContactInfo (Контактная информация)
```typescript
{
  id: number
  address: string
  phone: string
  email: string
  instagram?: string
  working_hours: string
  created_at: DateTime
  updated_at: DateTime
}
```

## Преимущества Prisma:

### 1. **Type Safety**
- Автоматическая генерация TypeScript типов
- Проверка типов на этапе компиляции
- IntelliSense в IDE

### 2. **Простота использования**
- Читаемый синтаксис запросов
- Автоматическая валидация данных
- Встроенная пагинация

### 3. **Производительность**
- Connection pooling
- Query optimization
- Prepared statements

### 4. **Безопасность**
- SQL injection protection
- Валидация на уровне схемы
- Type-safe параметры

## Примеры использования:

### Получение всех товаров с категориями:
```typescript
const products = await prisma.product.findMany({
  include: {
    category: true
  }
})
```

### Создание нового товара:
```typescript
const product = await prisma.product.create({
  data: {
    name: "Новый товар",
    short_description: "Описание",
    // ... другие поля
  }
})
```

### Фильтрация по категории:
```typescript
const products = await prisma.product.findMany({
  where: {
    category_id: 1
  }
})
```

## Проверка работы:

1. **Запустите проект**: `npm run dev`
2. **Откройте Prisma Studio**: `npx prisma studio`
3. **Проверьте API**: 
   - `http://localhost:3000/api/categories`
   - `http://localhost:3000/api/products`
   - `http://localhost:3000/api/contact`

## Возможные проблемы:

1. **Ошибка подключения** - проверьте DATABASE_URL в .env
2. **Схема не синхронизирована** - выполните `npm run db:push`
3. **Типы не обновлены** - выполните `npm run db:generate`

Prisma готов к использованию! 🚀
