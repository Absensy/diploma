# EmptyState Component

Универсальный компонент для отображения состояния "Нет записей" во всех компонентах приложения.

## Использование

```tsx
import EmptyState from '@/components/EmptyState/EmptyState';

// Базовое использование
<EmptyState message="Нет записей" />

// С дополнительными параметрами
<EmptyState 
  message="Товары не найдены"
  variant="card"
  height={300}
/>
```

## Параметры

- `message` (string, по умолчанию: "Нет записей") - Текст сообщения
- `icon` (React.ReactNode, опционально) - Кастомная иконка
- `variant` ('default' | 'minimal' | 'card', по умолчанию: 'default') - Вариант отображения
- `height` (string | number, по умолчанию: 200) - Высота компонента
- `sx` (object, опционально) - Дополнительные стили

## Варианты отображения

### default
Стандартный вариант с иконкой и текстом по центру.

### card
Отображается в виде карточки с тенью.

### minimal
Минимальный вариант только с текстом.

## Где используется

### Админские компоненты
- `src/app/admin/products/page.tsx` - "Товары не найдены"
- `src/app/admin/categories/page.tsx` - "Категории не найдены"

### Публичные компоненты
- `src/components/GranitCatalogCards/GranitCatalogCards.tsx` - "Товары не найдены"
- `src/components/GranitOurCatagol/GranitOurCatagol.tsx` - "Категории не найдены"
- `src/components/GranitExamplesOurWork/GrintExamplesOurWork.tsx` - "Примеры работ не найдены"

### Компоненты фильтров
- `src/components/GranitCatalogFilter/GranitCatalogFilter.tsx` - "Категории не найдены", "Материалы не найдены"
- `src/components/MobileFilterDrawer/MobileFilterDrawer.tsx` - "Категории не найдены", "Материалы не найдены"

## Примеры

```tsx
// Для админки
<EmptyState 
  message="Товары не найдены"
  variant="card"
  height={300}
/>

// Для публичных страниц
<EmptyState 
  message="Категории не найдены"
  variant="default"
  height={200}
/>

// Минимальный вариант
<EmptyState 
  message="Нет данных"
  variant="minimal"
/>

// Для фильтров
<EmptyState 
  message="Категории не найдены"
  variant="minimal"
  height={60}
/>
```
