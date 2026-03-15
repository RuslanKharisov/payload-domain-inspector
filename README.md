payload-domain-inspector
Утилита для инди-разработчиков на Payload CMS, которая анализирует файл payload-types.ts и генерирует компактную доменную схему (аналог Prisma schema) и ER-диаграмму в формате Mermaid.
✨ Зачем это нужно?

- Быстрый старт: Мгновенно разберитесь в структуре чужого или старого Payload-проекта.
- Коммуникация: Наглядно объясните архитектуру базы данных команде или заказчику.
- Обучение и докс: Идеально подходит для использования в документации или обучающих курсах (например, в курсе «Payload для инди-разработчиков»).

🚀 Установка

npm install --save-dev payload-domain-inspector# или запуск без установки
npx payload-domain-inspector ./payload-types.ts

🛠 Использование
Запустите утилиту в корне проекта, где находится файл типов:

npx payload-domain-inspector ./payload-types.ts

По умолчанию создаются три файла:

1.  domain-schema.ts — типизированный список сущностей и полей.
2.  domain.er.mmd — ER-диаграмма для визуализации в Mermaid.
3.  domain-summary.md — текстовое описание сущностей и связей.

⚙️ Конфигурация
Для гибкой настройки создайте файл payload-domain.config.json:

{
"input": "./payload-types.ts",
"outputDir": "./domain",
"includeEntities": ["User", "Tenant", "Product", "Stock", "Warehouse"],
"ignoreFields": ["createdAt", "updatedAt", "version"],
"formats": ["ts", "mermaid", "md"]
}

После этого утилиту можно запускать без аргументов:

npx payload-domain-inspector

📂 Встраивание в проект
Добавьте команду в ваш package.json:

{
"scripts": {
"domain:generate": "payload-domain-inspector"
}
}

Теперь генерировать схему можно одной командой:

npm run domain:generate

---

💡 Интересный факт: В рамках курса «Payload для инди-разработчиков» (модуль «Утилита для чтения проекта») мы пошагово разбираем внутреннее устройство этого инструмента и реализуем его с нуля.
