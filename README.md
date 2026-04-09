<p align="center">
  <img src="logo.svg" width="80" height="80" alt="Mockraft Logo">
</p>

<h1 align="center">Mockraft</h1>

<p align="center">
  <strong>AI-Powered API Mocking Tool</strong>
</p>

<p align="center">
  <a href="#english">English</a> | <a href="#russian">Русский</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node">
  <img src="https://img.shields.io/badge/OpenAPI-3.x-orange.svg" alt="OpenAPI">
  <img src="https://img.shields.io/badge/AI-OpenRouter-purple.svg" alt="AI">
</p>

---

<a id="english"></a>

## English

Generate realistic mock APIs from OpenAPI specs using AI. Upload your spec — get a working mock server with smart data in seconds.

### Features

- **AI-Powered Data Generation** — Uses OpenRouter AI models (free & paid) to generate realistic, contextually appropriate mock data
- **Instant Mock Server** — Parse OpenAPI 3.x spec and spin up Express server automatically
- **CLI + Web Interface** — Same engine, use from terminal (`npx`) or browser
- **Smart Fallback** — Works without API key using built-in heuristic generator
- **Scenarios** — Simulate delays, errors (500, 503...), rate limiting per endpoint
- **Proxy Mode** — Route some requests to real API, others to mocks
- **Natural Language Config** — Describe what you want: *"3 users with Russian names"*
- **i18n** — English and Russian out of the box

### Quick Start

#### CLI

```bash
# Start mock server from spec
npx @mockraft/cli start ./api-spec.yaml

# Generate mock data to stdout
npx @mockraft/cli generate ./api-spec.yaml

# Validate spec
npx @mockraft/cli validate ./api-spec.yaml

# Save your OpenRouter API key
npx @mockraft/cli config --key sk-or-v1-your-key-here
```

#### Options

| Flag | Description |
|------|------------|
| `-p, --port <port>` | Server port (default: 3456) |
| `-k, --key <key>` | OpenRouter API key |
| `-m, --model <model>` | AI model to use |
| `-l, --lang <lang>` | Language: en / ru |
| `--proxy <url>` | Proxy unmatched requests |

#### Web Interface

```bash
cd packages/web
npm run dev
```

Open `http://localhost:5173` — upload spec, configure endpoints, start server.

### AI Models

Mockraft uses [OpenRouter](https://openrouter.ai/) for AI generation. Free models included:

| Model | Tier |
|-------|------|
| Llama 4 Scout | Free |
| Mistral Small 3.1 | Free |
| Gemma 3 27B | Free |
| Qwen 2.5 72B | Free |
| Claude Sonnet 4 | Paid |
| GPT-4o | Paid |
| Gemini 2.5 Flash | Paid |

No API key needed — the fallback generator produces reasonable data using field name heuristics.

### Project Structure

```
mockraft/
├── packages/
│   ├── core/     # Shared engine: parser, AI, generator, server
│   ├── cli/      # Command-line interface
│   └── web/      # React web interface
├── examples/     # Sample OpenAPI specs
└── logo.svg
```

### Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run web dev server
npm run dev

# Run CLI locally
node packages/cli/dist/index.js start examples/petstore.yaml
```

### License

MIT

---

<a id="russian"></a>

## Русский

Генерация реалистичных моков API из OpenAPI спецификаций с помощью ИИ. Загрузите спецификацию — получите рабочий мок-сервер с умными данными за секунды.

### Возможности

- **ИИ-генерация данных** — Использует модели OpenRouter (бесплатные и платные) для генерации реалистичных данных
- **Мгновенный мок-сервер** — Парсинг OpenAPI 3.x спеки и автоматический запуск Express-сервера
- **CLI + Веб-интерфейс** — Один движок, используйте из терминала (`npx`) или браузера
- **Умный фоллбэк** — Работает без API-ключа благодаря встроенному генератору
- **Сценарии** — Симуляция задержек, ошибок (500, 503...), rate limiting по эндпоинтам
- **Прокси-режим** — Часть запросов на реальный API, часть на моки
- **Конфигурация на естественном языке** — Опишите что нужно: *"3 пользователя с русскими именами"*
- **i18n** — Английский и русский из коробки

### Быстрый старт

#### CLI

```bash
# Запуск мок-сервера из спецификации
npx @mockraft/cli start ./api-spec.yaml

# Генерация мок-данных в stdout
npx @mockraft/cli generate ./api-spec.yaml

# Валидация спецификации
npx @mockraft/cli validate ./api-spec.yaml

# Сохранение API-ключа OpenRouter
npx @mockraft/cli config --key sk-or-v1-ваш-ключ

# Переключение на русский язык
npx @mockraft/cli start ./api-spec.yaml --lang ru
```

#### Параметры

| Флаг | Описание |
|------|----------|
| `-p, --port <порт>` | Порт сервера (по умолчанию: 3456) |
| `-k, --key <ключ>` | API-ключ OpenRouter |
| `-m, --model <модель>` | Модель ИИ |
| `-l, --lang <язык>` | Язык: en / ru |
| `--proxy <url>` | Проксирование запросов |

#### Веб-интерфейс

```bash
cd packages/web
npm run dev
```

Откройте `http://localhost:5173` — загрузите спеку, настройте эндпоинты, запустите сервер.

### Модели ИИ

Mockraft использует [OpenRouter](https://openrouter.ai/) для ИИ-генерации. Бесплатные модели включены:

| Модель | Уровень |
|--------|---------|
| Llama 4 Scout | Бесплатно |
| Mistral Small 3.1 | Бесплатно |
| Gemma 3 27B | Бесплатно |
| Qwen 2.5 72B | Бесплатно |
| Claude Sonnet 4 | Платно |
| GPT-4o | Платно |
| Gemini 2.5 Flash | Платно |

API-ключ не обязателен — встроенный генератор создает осмысленные данные на основе эвристик по именам полей.

### Структура проекта

```
mockraft/
├── packages/
│   ├── core/     # Общий движок: парсер, ИИ, генератор, сервер
│   ├── cli/      # Интерфейс командной строки
│   └── web/      # React веб-интерфейс
├── examples/     # Примеры OpenAPI спецификаций
└── logo.svg
```

### Разработка

```bash
# Установка зависимостей
npm install

# Сборка всех пакетов
npm run build

# Запуск веб-интерфейса для разработки
npm run dev

# Запуск CLI локально
node packages/cli/dist/index.js start examples/petstore.yaml
```

### Лицензия

MIT
