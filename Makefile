.PHONY: help install dev build test clean docker-up docker-down migrate seed

help:
	@echo "Service Request App - Available Commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Run development servers (frontend + backend)"
	@echo "  make build        - Build production frontend"
	@echo "  make test         - Run all tests"
	@echo "  make migrate      - Run database migrations"
	@echo "  make seed         - Seed database with sample data"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make clean        - Clean node_modules and build files"

install:
	npm install
	cd backend && npm install
	cd frontend && npm install

dev:
	npm run dev

build:
	cd frontend && npm run build

test:
	cd backend && npm test

migrate:
	cd backend && npm run migrate

seed:
	cd backend && npm run seed

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose build

clean:
	rm -rf node_modules
	rm -rf backend/node_modules
	rm -rf frontend/node_modules
	rm -rf frontend/build
