### Hexlet tests and linter status:
[![Actions Status](https://github.com/kirillchistov/fullstack-javascript-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kirillchistov/fullstack-javascript-project-6/actions)

## Task Manager

- Система управления задачами, подобная Redmine. Она позволяет ставить задачи, назначать исполнителей и менять их статусы. Для работы с системой требуется регистрация и аутентификация.
- Этот проект охватывает ключевые аспекты разработки сайтов, в том числе сборку (webpack) и деплой, ORM (o2m, m2m).
- В работе используется веб-фреймворк Fastify, шаблонизация Pug и Bootstrap.
- Шаблон приложения: [fastify-nodejs-application](https://github.com/hexlet-boilerplates/fastify-nodejs-application).

## Демо

- [Пример проекта Hexlet](https://js-task-manager-ru.hexlet.app/)
- [Задеплоенное приложение](https://hexlet-task-manager-n821.onrender.com) — здесь добавлю ссылку после деплоя на Render

## Установка

```bash
cp .env.example .env   # если ещё не создан
npm install --legacy-peer-deps
make setup
```


Команда скопирует `.env.example` в `.env`, установит зависимости, выполнит миграции и соберёт фронтенд.

## Запуск

```bash
make start
```

Приложение доступно на [http://localhost:5001](http://localhost:5001) (порт задаётся в `.env`, по умолчанию 5001 — на macOS порт 5000 часто занят AirPlay).

На главной странице (`/`) должно отображаться приветствие «Привет от Хекслета!».

## Разработка

```bash
make start
```

Запускает backend и webpack watch через `heroku local` (см. `Procfile.dev`).

## Тесты

```bash
make test
```

## Деплой на Render

1. Зарегистрироваться на [render.com](https://render.com).
2. Подключите GitHub-репозиторий проекта.
3. Создать **Blueprint** из файла `render.yaml` в корне репозитория  
   (или вручную: Web Service + PostgreSQL Free).
4. **Обязательно** задайте переменные окружения (Dashboard → Environment):
   - `NODE_VERSION=20.18.3` — без этого Render может взять Node 26 и сборка упадёт
   - `NODE_ENV=production`
   - `SESSION_KEY` — случайная строка (Render может сгенерировать)
   - `DATABASE_URL` — подставляется автоматически при связке с PostgreSQL
5. **Build Command:** `npm install --legacy-peer-deps --ignore-scripts && npm run build && npx knex migrate:latest`
6. **Start Command:** `npm start`
7. После изменений нажмите **Manual Deploy → Clear build cache & deploy**
8. После успешного деплоя замените ссылку в разделе «Демо» выше.

Подробнее: [Render Docs](https://render.com/docs), [PostgreSQL на Render](https://render.com/docs/postgresql-creating-connecting).

## Шаги и задачи

### Шаг 2
- [ ] Использовать [fastify nodejs application](https://github.com/hexlet-boilerplates/fastify-nodejs-application), как шаблон для своего приложения
- [ ] Настроить базовое окружение, которое после старта на http-запрос на главную страницу (/) выдает приветствие
- [ ] [Задеплоить на Render](https://hexlet-task-manager-n821.onrender.com) то что получилось
- [x] Добавить в README.md [ссылку на деплой](https://hexlet-task-manager-n821.onrender.com)

### Шаг 1
- [x] Подключиться к GitHub и [создать репозиторий](https://github.com/kirillchistov/fullstack-javascript-project-6)
- [x] Посмотреть описание и [пример проекта](https://js-task-manager-ru.hexlet.app/)
- [x] Подготовить рабочее окружение к разработке

## Документация

- [how-it-works.md](./how-it-works.md) — архитектура проекта и схема взаимодействия клиент–сервер
