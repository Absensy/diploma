# 🔧 Диагностика проблем с базой данных

## ✅ Текущий статус

База данных работает нормально:
- ✅ Подключение успешно
- ✅ 5 категорий
- ✅ 25 товаров
- ✅ 6 пользователей
- ✅ 15 заказов
- ✅ 7 материалов
- ✅ 12 тегов

## 🔍 Если база данных не работает

### 1. Проверка подключения

```bash
# Запустите диагностику
npx tsx scripts/test-db-connection.ts

# Или полную диагностику
npx tsx scripts/diagnose-db.ts
```

### 2. Проверка переменных окружения

Убедитесь, что файл `.env` или `.env.local` содержит:

```env
DATABASE_URL="postgresql://postgres:123123@localhost:5432/granit_memory"
```

### 3. Проверка PostgreSQL

```bash
# Проверьте, запущен ли PostgreSQL
# Windows (PowerShell):
Get-Service -Name postgresql*

# Или через pgAdmin / psql
psql -U postgres -d granit_memory
```

### 4. Синхронизация схемы

```bash
# Синхронизировать схему с базой данных
npx prisma db push

# Сгенерировать Prisma Client
npx prisma generate
```

### 5. Перезапуск dev-сервера

```bash
# Остановите сервер (Ctrl+C)
# Очистите кэш
Remove-Item -Recurse -Force .next

# Запустите снова
npm run dev
```

## 🐛 Частые ошибки

### P1001: Can't reach database server
**Решение:** Убедитесь, что PostgreSQL запущен

### P1000: Authentication failed
**Решение:** Проверьте пароль в DATABASE_URL

### P1003: Database does not exist
**Решение:** Создайте базу данных:
```sql
CREATE DATABASE granit_memory;
```

### P2002: Unique constraint failed
**Решение:** Пытаетесь создать запись с уже существующим уникальным значением (slug, email, etc.)

## 📞 Если проблема не решена

1. Проверьте логи сервера в терминале
2. Проверьте консоль браузера (F12)
3. Запустите диагностику: `npx tsx scripts/diagnose-db.ts`
4. Проверьте, что все миграции применены: `npx prisma migrate status`
