import type { Entity } from "../src/types";

export async function parsePayloadTypes(inputPath: string): Promise<Entity[]> {
  // TODO: здесь позже будет парсинг payload-types через TypeScript AST
  // Сейчас возвращаем фиктивные данные для проверки пайплайна.
  const entities: Entity[] = [
    {
      name: "Product",
      fields: [
        {
          name: "id",
          type: "ID",
          kind: "primitive",
          isArray: false,
          isOptional: false,
        },
        {
          name: "title",
          type: "string",
          kind: "primitive",
          isArray: false,
          isOptional: false,
        },
        {
          name: "sku",
          type: "string",
          kind: "primitive",
          isArray: false,
          isOptional: false,
        },
        {
          name: "brand",
          type: "Brand",
          kind: "relation",
          isArray: false,
          isOptional: true,
        },
      ],
    },
    {
      name: "Stock",
      fields: [
        {
          name: "id",
          type: "ID",
          kind: "primitive",
          isArray: false,
          isOptional: false,
        },
        {
          name: "product",
          type: "Product",
          kind: "relation",
          isArray: false,
          isOptional: false,
        },
        {
          name: "quantity",
          type: "number",
          kind: "primitive",
          isArray: false,
          isOptional: false,
        },
      ],
    },
  ];

  return entities;
}
