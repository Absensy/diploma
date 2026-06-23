#!/usr/bin/env bash
# Сборка приложения Г (листинг программы) из реальных файлов исходного кода.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="docs/Приложение-Г-листинг.txt"

# Каждый элемент: путь|номер|название|часть(frontend/backend)
items=(
  "src/lib/prisma.ts|Г.1|Подключение к базе данных (Prisma Client)|backend"
  "src/lib/password.ts|Г.2|Хеширование и проверка паролей|backend"
  "src/middleware.ts|Г.3|Промежуточный обработчик защиты маршрутов (middleware)|backend"
  "src/app/api/auth/login/route.ts|Г.4|Маршрут авторизации администратора|backend"
  "src/app/api/auth/verify/route.ts|Г.5|Маршрут проверки токена авторизации|backend"
  "src/app/api/orders/route.ts|Г.6|Серверный маршрут оформления заказа|backend"
  "src/lib/services/order.service.ts|Г.7|Сервис заказов (бизнес-логика)|backend"
  "src/lib/orderStatus.ts|Г.8|Статусы заказа и допустимые переходы|backend"
  "src/lib/orderLabels.ts|Г.9|Подписи статусов и значений заказа|backend"
  "src/lib/services/email.service.ts|Г.10|Сервис отправки электронной почты|backend"
  "src/app/api/upload/route.ts|Г.11|Маршрут загрузки и валидации файлов|backend"
  "src/contexts/FilterContext.tsx|Г.12|Контекст фильтрации каталога|frontend"
  "src/contexts/ContactContext.tsx|Г.13|Контекст контактной информации|frontend"
  "src/hooks/useProducts.ts|Г.14|Хук загрузки списка товаров|frontend"
  "src/hooks/useFilteredProducts.ts|Г.15|Хук фильтрации и сортировки товаров|frontend"
  "src/components/ProductModal/ProductModal.tsx|Г.16|Модальное окно карточки товара|frontend"
  "src/components/OrderStatusStepper/OrderStatusStepper.tsx|Г.17|Индикатор статусов заказа|frontend"
  "src/app/checkout/page.tsx|Г.18|Страница оформления заказа|frontend"
  "src/app/checkout/_components/ContactStep.tsx|Г.19|Шаг ввода контактных и паспортных данных|frontend"
  "src/app/checkout/_validation.ts|Г.20|Клиентская валидация форм оформления заказа|frontend"
)

{
  echo "ПРИЛОЖЕНИЕ Г"
  echo "(обязательное)"
  echo
  echo "Листинг программы"
  echo
  echo "В приложении приведён листинг исходного кода ключевых модулей веб-приложения «Гранит памяти». Сначала следует код серверной части (backend), затем — клиентской части (frontend). Каждый фрагмент снабжён названием модуля и указанием пути к файлу в структуре проекта, что позволяет ссылаться на него из текста пояснительной записки по названию."
  echo

  current_part=""
  for it in "${items[@]}"; do
    IFS='|' read -r path num name part <<< "$it"
    if [ "$part" != "$current_part" ]; then
      if [ "$part" = "backend" ]; then
        echo "Серверная часть (backend)"
      else
        echo "Клиентская часть (frontend)"
      fi
      echo
      current_part="$part"
    fi
    echo "$name"
    echo "Файл: $path"
    echo
    cat "$path"
    echo
    echo
  done
} > "$OUT"

lines=$(wc -l < "$OUT")
echo "Создан $OUT ($lines строк)"
