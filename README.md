# payload-domain-inspector

Утилита для инди‑разработчиков на Payload CMS, которая анализирует `payload-types.ts` и генерирует компактную доменную схему (аналог Prisma schema) и ER‑диаграмму в формате Mermaid. [payloadcms](https://payloadcms.com/docs/typescript/generating-types)

## ✨ Зачем это нужно

- **Быстрый старт:** мгновенно разобраться в структуре чужого или «заброшенного» Payload‑проекта.
- **Коммуникация:** наглядно объяснить архитектуру данных команде или заказчику.
- **Обучение и документация:** удобно использовать в доке и обучающих материалах (например, в курсе «Payload для инди‑разработчиков»).

## 🚀 Установка

```bash
npm install --save-dev payload-domain-inspector
# или запуск без установки
npx payload-domain-inspector ./payload-types.ts
```

## 🛠 Использование

Запустите утилиту в корне проекта, где находится `payload-types.ts`:

```bash
npx payload-domain-inspector ./payload-types.ts
```

По умолчанию будут сгенерированы файлы в директории `./domain`:

1. `domain-schema.ts` — список сущностей и полей в компактном DSL.
2. `domain.er.mmd` — ER‑диаграмма для визуализации в Mermaid. [mermaid.js](http://mermaid.js.org/syntax/entityRelationshipDiagram.html)
3. `domain-summary.md` — текстовое описание сущностей и их полей.

## ⚙️ Конфигурация

Для гибкой настройки создайте `payload-domain.config.json` в корне проекта:

```json
{
  "input": "./payload-types.ts",
  "outputDir": "./domain",
  "includeEntities": ["User", "Tenant", "Product", "Stock", "Warehouse"],
  "ignoreFields": ["id", "createdAt", "updatedAt", "version"],
  "ignoreEntities": ["Media", "Form", "Search"],
  "formats": ["ts", "mermaid", "md"]
}
```

После этого утилиту можно запускать без аргументов:

```bash
npx payload-domain-inspector
```

## 📂 Встраивание в проект

Добавьте скрипт в `package.json`:

```json
{
  "scripts": {
    "domain:generate": "payload-domain-inspector"
  }
}
```

Теперь генерировать схему можно одной командой:

```bash
npm run domain:generate
```

---

💡 В рамках курса «Payload для инди‑разработчиков» (модуль «Утилита для чтения проекта») утилита разбирается и реализуется пошагово — от парсинга `payload-types.ts` до генерации схемы и ER‑диаграммы.
