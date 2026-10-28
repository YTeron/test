
# Запустить все сервисы (в фоне)
docker compose up -d

# Запустить с пересборкой образов
docker compose up -d --build

# Запустить конкретный сервис
docker compose up -d имя_сервиса

# Посмотреть статус контейнеров
docker compose ps

# 3. Открыть в браузере
# http://localhost:8080