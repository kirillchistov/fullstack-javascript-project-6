### Hexlet tests and linter status:
[![Actions Status](https://github.com/kirillchistov/fullstack-javascript-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kirillchistov/fullstack-javascript-project-6/actions)

## Task Manager

- Система управления задачами, подобная Redmine. Она позволяет ставить задачи, назначать исполнителей и менять их статусы. Для работы с системой требуется регистрация и аутентификация.
- Этот проект охватывает ключевые аспекты разработки сайтов, в том числе сборку (webpack) и деплой, ORM (o2m, m2m).
- В работе используется веб-фреймворк Fastify, серверный рендеринг (Pug), Bootstrap и i18next.
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
make setup
make start
```

Или напрямую:

```bash
npm run start:dev
```

Приложение доступно на [http://localhost:5001](http://localhost:5001) (порт задаётся в `.env`, по умолчанию 5001 — на macOS порт 5000 часто занят AirPlay).

На главной странице (`/`) — Bootstrap navbar с пунктами Users / Login / Register и hero-блок с приветствием (тексты из i18next, язык по умолчанию — English).

## Разработка

С hot-reload backend и webpack watch в одном терминале:

```bash
make develop
```

Или в двух терминалах:

```bash
make start-frontend   # терминал 1
make start-backend    # терминал 2
```

Если установлен [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli), можно использовать `make start-heroku`.

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
5. **Build Command:** `npm install --include=dev --legacy-peer-deps --ignore-scripts && npm run build && npx knex migrate:latest && npm prune --omit=dev`
6. **Start Command:** `npm start`
7. После изменений нажмите **Manual Deploy → Clear build cache & deploy**
8. После успешного деплоя замените ссылку в разделе «Демо» выше.

Подробнее: [Render Docs](https://render.com/docs), [PostgreSQL на Render](https://render.com/docs/postgresql-creating-connecting).

## Шаги и задачи

### Шаг 7
- [x] Реализовать CRUD меток.
- [x] Сделать возможность добавления меток в задачи при их создании и изменении.
- [x] Организовать связь m2m с задачами.
- [x] Написать нужные тесты. Для возможности выбора нескольких меток использовать тег se

### Шаг 6
- [x] Написать тесты на контроллер задач.
- [x] Реализовать CRUD задач. Подключить флэш сообщения.
- [x] Добавить ссылку на список задач в основное меню.
- [x] Сделать так, чтобы добавлять, редактировать задачи могли бы только залогиненные пользователи. Удалять задачи может только создатель.
- [x] В качестве языка по умолчанию использовать английский, все переводы и локализацию хранить в i18n. Организовать хранение текстов в i18n и их подстановку в шаблоне.

### Шаг 5
- [x] Фронт: Создать страницу статусов и создания статусов, аналогично демонстрационному 
проекту и добавьте ссылку на неё в основном меню
- [x] Бэк: Написать тесты для CRUD статусов.
- [x] Реализовать CRUD статусов.
- [x] Подключить флэш сообщения, как в демо-проекте.
- [x] Добавить ссылку на список статусов в основное меню.
- [x] Сделать так, чтобы добавлять, редактировать и удалять статусы могли бы только залогиненные пользователи.

### Шаг 4
- [x] Изучить библиотеки, используемые в шаблоне, их предназначение.
- [x] Фронт: проверить, что на странице пользователей, выводится список пользователей, он должен быть доступен без авторизации.
- [x] Фронт: Проверить работоспособность страниц регистрации и аутентификации.
- [x] Бэк: Написать тесты для CRUD пользователей
- [x] Бэк: Доделать CRUD пользователей: регистрация, обновление и удаление. Редактирование и удаление доступно из настроек, а список пользователей доступен для всех по ссылке из главного меню. Редактировать и обновлять себя может только сам пользователь
- [x] Бэк: Реализовать аутентификацию с использованием куки. В бойлерплейте уже подключена и настроена библиотека
- [x] Бэк: Реализовать редиректы, как в демо-проекте

### Шаг 3
- [x] Выбрать из [Bootstrap Examples](https://getbootstrap.com/docs/5.3/examples/) дизайн для приложения
- [x] Подключить дизайн и настроить Fastify для отдачи главной страницы на `/`
- [x] Организовать хранение текстов в i18next и подстановку в Pug-шаблонах

### Шаг 2
- [x] Использовать [fastify nodejs application](https://github.com/hexlet-boilerplates/fastify-nodejs-application), как шаблон для своего приложения
- [x] Настроить базовое окружение, которое после старта на http-запрос на главную страницу (/) выдает приветствие
- [x] [Задеплоить на Render](https://hexlet-task-manager-n821.onrender.com) то что получилось
- [x] Добавить в README.md [ссылку на деплой](https://hexlet-task-manager-n821.onrender.com)

### Шаг 1
- [x] Подключиться к GitHub и [создать репозиторий](https://github.com/kirillchistov/fullstack-javascript-project-6)
- [x] Посмотреть описание и [пример проекта](https://js-task-manager-ru.hexlet.app/)
- [x] Подготовить рабочее окружение к разработке

## Документация

- [how-it-works.md](./how-it-works.md) — архитектура проекта и схема взаимодействия клиент–сервер
