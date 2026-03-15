import fs from "node:fs";
import path from "node:path";

/**
 * Конфигурация инспектора доменной схемы Payload.
 *
 * Может задаваться через файл `payload-domain.config.json`
 * в корне проекта, где лежит `payload-types.ts`.
 *
 * Пример:
 * {
 *   "input": "./payload-types.ts",
 *   "outputDir": "./domain",
 *   "ignoreFields": ["id", "createdAt", "updatedAt"],
 *   "ignoreEntities": ["Media", "Form"],
 *   "formats": ["ts", "mermaid", "md"]
 * }
 */
export type InspectorConfig = {
  /**
   * Путь до файла `payload-types.ts` относительно cwd.
   * По умолчанию: "./payload-types.ts".
   */
  input: string;

  /**
   * Каталог, куда будут записаны результаты генерации.
   * По умолчанию: "./domain".
   */
  outputDir: string;

  /**
   * Белый список сущностей (interface-ов) для включения.
   * Если указан, инспектор будет обрабатывать только эти сущности.
   */
  includeEntities?: string[];

  /**
   * Список имён полей, которые нужно скрыть
   * во всех сущностях (служебные поля и т.п.).
   */
  ignoreFields?: string[];

  /**
   * Список имён сущностей (interface-ов), которые нужно
   * полностью исключить из доменной схемы.
   * Удобно для тех сущностей, которые не относятся к домену
   * (служебные коллекции Payload, формы, поиск и т.п.).
   */
  ignoreEntities?: string[];

  /**
   * Набор форматов, которые нужно сгенерировать:
   * - "ts"      → domain-schema.ts (DSL-представление сущностей)
   * - "mermaid" → domain.er.mmd (ER-диаграмма Mermaid)
   * - "md"      → domain-summary.md (Markdown-описание сущностей)
   */
  formats?: ("ts" | "mermaid" | "md")[];
};

/**
 * Значения сущностей, которые по умолчанию считаются
 * техническими и не попадают в доменную схему.
 *
 * При необходимости могут быть переопределены в
 * `payload-domain.config.json` через поле ignoreEntities.
 */
export const DEFAULT_IGNORED_ENTITIES = [
  "PayloadKv",
  "PayloadJob",
  "PayloadLockedDocument",
  "PayloadPreference",
  "PayloadMigration",
  "Form",
  "FormSubmission",
  "Search",
  "Media",
  "Page",
  "Post",
];

/**
 * Базовая конфигурация инспектора.
 * Используется, если рядом с проектом нет
 * `payload-domain.config.json`, либо как дефолт,
 * поверх которого мержится пользовательский конфиг.
 */
const DEFAULT_CONFIG: InspectorConfig = {
  input: "./payload-types.ts",
  outputDir: "./domain",
  formats: ["ts", "mermaid", "md"],
  ignoreFields: [
    "id",
    "createdAt",
    "updatedAt",
    "version",
    "slugLock",
    "__typename",
  ],
  ignoreEntities: DEFAULT_IGNORED_ENTITIES,
};

/**
 * Загружает конфиг инспектора из файла
 * `payload-domain.config.json` в текущем рабочем каталоге.
 *
 * Если файл не найден, возвращаются значения по умолчанию.
 * Если файл найден, значения мержатся поверх DEFAULT_CONFIG.
 */
export function loadConfig(cwd: string): InspectorConfig {
  const configPath = path.join(cwd, "payload-domain.config.json");

  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<InspectorConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  }

  return DEFAULT_CONFIG;
}
