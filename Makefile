# Команды Makefile для локальной установки, сборки и запуска приложения.

setup: prepare install db-migrate build

install:
	npm install

db-migrate:
	npx knex migrate:latest

build:
	npm run build

prepare:
	cp -n .env.example .env || true

start:
	heroku local -f Procfile.dev

start-backend:
	npm run start:dev -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --watch --progress

develop: start-backend start-frontend

lint:
	npx eslint .

test:
	npm test -s
