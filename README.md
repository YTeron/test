# 1. Собрать образ
docker build -t ntd .

# 2. Запустить контейнер
docker run --name ntd -p 8080:8080 ntd

# 3. Открыть в браузере
# http://localhost:8080