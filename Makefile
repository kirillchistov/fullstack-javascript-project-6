# Команды Makefile для локальной установки, сборки и запуска приложения.

setup: prepare install db-migrate build

install:
	npm install --legacy-peer-deps

db-migrate:
	npx knex migrate:latest

build:
	npm run build

prepare:
	cp -n .env.example .env || true

# Быстрый запуск после make setup (Heroku CLI не требуется)
start:
	npm run start:dev

# Backend с hot-reload (Node --watch)
develop:
	npx webpack --watch --progress & npm run start:dev

start-backend:
	npm run start:dev

start-frontend:
	npx webpack --watch --progress

# Оригинальный способ из шаблона Hexlet (нужен установленный Heroku CLI)
start-heroku:
	heroku local -f Procfile.dev

lint:
	npx eslint .

test:
	npm test -s

.PHONY: setup install db-migrate build prepare start develop start-backend start-frontend start-heroku lint test
