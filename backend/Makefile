# Makefile for common development tasks
# Similar to Django management commands

.PHONY: help install dev run test lint format migrate db-up db-down clean

# Default target
help:
	@echo "AI Usage Control - Backend"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Setup:"
	@echo "  install     Install production dependencies"
	@echo "  dev         Install development dependencies"
	@echo ""
	@echo "Development:"
	@echo "  run         Run development server (like: python manage.py runserver)"
	@echo "  test        Run tests (like: python manage.py test)"
	@echo "  lint        Run linters"
	@echo "  format      Format code with black"
	@echo ""
	@echo "Database:"
	@echo "  db-up       Start PostgreSQL + Redis (Docker)"
	@echo "  db-down     Stop PostgreSQL + Redis"
	@echo "  migrate     Run database migrations (like: python manage.py migrate)"
	@echo "  makemigrations  Generate migrations (like: python manage.py makemigrations)"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean       Remove cache and temporary files"

# Setup
install:
	pip install -r requirements.txt

dev:
	pip install -r requirements.txt

# Development
run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest -v

lint:
	ruff check .
	mypy app/

format:
	black .
	ruff check --fix .

# Database
db-up:
	docker-compose -f ../infrastructure/docker/docker-compose.yml up -d

db-down:
	docker-compose -f ../infrastructure/docker/docker-compose.yml down

migrate:
	alembic upgrade head

makemigrations:
	@read -p "Migration message: " msg; \
	alembic revision --autogenerate -m "$$msg"

# Cleanup
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	rm -f test.db
