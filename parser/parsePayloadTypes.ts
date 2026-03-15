import ts from "typescript";
import type { Entity, Field } from "../src/types";
import { loadConfig } from "../src/config";

export async function parsePayloadTypes(inputPath: string): Promise<Entity[]> {
  const program = ts.createProgram([inputPath], { allowJs: true });
  const sourceFile = program.getSourceFile(inputPath);
  if (!sourceFile) throw new Error("No source file");

  const config = loadConfig(process.cwd());
  const entities: Entity[] = [];
  const typeNames = new Set<string>();

  sourceFile.forEachChild((node) => {
    // Используем node.name.getText(sourceFile) для надежности
    if (ts.isInterfaceDeclaration(node) && node.name.text === "Config") {
      const collectionsProp = node.members.find((member) => {
        if (!ts.isPropertySignature(member)) return false;
        // Извлекаем имя свойства без getText(), чтобы избежать ошибок undefined
        const propName =
          member.name && ts.isIdentifier(member.name)
            ? member.name.text
            : member.name?.getText(sourceFile);
        return propName === "collections";
      }) as ts.PropertySignature;

      if (collectionsProp?.type && ts.isTypeLiteralNode(collectionsProp.type)) {
        collectionsProp.type.members.forEach((member) => {
          if (ts.isPropertySignature(member)) {
            // Очищаем имя от кавычек
            const name = member.name.getText(sourceFile).replace(/['"]/g, "");

            // Получаем имя типа (например, 'Product')
            let typeName = "any";
            if (member.type && ts.isTypeReferenceNode(member.type)) {
              const typeName = member.type.typeName.getText(sourceFile);
              if (config.ignoreEntities?.includes(typeName)) return;
              typeNames.add(typeName);
              console.log(`Найдена сущность: ${name} (тип: ${typeName})`);
            }
          }
        });
      }
    }
  });

  sourceFile.forEachChild((node) => {
    if (ts.isInterfaceDeclaration(node)) {
      const ifaceName = node.name.text;
      if (!typeNames.has(ifaceName)) return;

      const fields: Field[] = [];

      for (const member of node.members) {
        if (!ts.isPropertySignature(member) || !member.type) continue;

        const fieldName = member.name.getText(sourceFile).replace(/['"]/g, "");
        const fieldTypeNode = member.type;
        const fieldTypeText = fieldTypeNode.getText(sourceFile);

        const isArray =
          ts.isArrayTypeNode(fieldTypeNode) || fieldTypeText.endsWith("[]");

        const isOptional = !!member.questionToken;

        // Базовая эвристика: если тип ссылается на другую сущность — relation
        const { rawType, kind } = resolveFieldType(
          fieldTypeNode,
          typeNames,
          sourceFile,
        );

        if (config.ignoreFields?.includes(fieldName)) {
          continue;
        }

        fields.push({
          name: fieldName,
          type: rawType,
          kind,
          isArray,
          isOptional,
        });
      }

      if (config.ignoreEntities?.includes(ifaceName)) return;
      entities.push({ name: ifaceName, fields });
    }
  });

  console.log("entities for summary:", entities.length);
  return entities;
}

// обработка union‑типов типа tenant: '(number | null) | Tenant', product: 'number | Product' и т.п

function resolveFieldType(
  fieldTypeNode: ts.TypeNode,
  typeNames: Set<string>,
  sourceFile: ts.SourceFile,
): { rawType: string; kind: Field["kind"] } {
  // 1. Чистая ссылка на тип: Product, Tenant, ...
  if (ts.isTypeReferenceNode(fieldTypeNode)) {
    const refName = fieldTypeNode.typeName.getText(sourceFile);
    return {
      rawType: refName,
      kind: typeNames.has(refName) ? "relation" : "primitive",
    };
  }

  // 2. Union-тип: (number | null) | Tenant, number | Product, ...
  if (ts.isUnionTypeNode(fieldTypeNode)) {
    for (const t of fieldTypeNode.types) {
      if (ts.isTypeReferenceNode(t)) {
        const refName = t.typeName.getText(sourceFile);
        return {
          rawType: refName,
          kind: typeNames.has(refName) ? "relation" : "primitive",
        };
      }
    }
    // если не нашли type reference в union — пусть будет primitive
    return {
      rawType: fieldTypeNode.getText(sourceFile),
      kind: "primitive",
    };
  }

  // 3. Массив: SomeType[]
  if (ts.isArrayTypeNode(fieldTypeNode)) {
    const elementType = fieldTypeNode.elementType;
    if (ts.isTypeReferenceNode(elementType)) {
      const refName = elementType.typeName.getText(sourceFile);
      return {
        rawType: refName,
        kind: typeNames.has(refName) ? "relation" : "primitive",
      };
    }
    return {
      rawType: elementType.getText(sourceFile),
      kind: "primitive",
    };
  }

  // 4. Всё остальное — как primitive
  return {
    rawType: fieldTypeNode.getText(sourceFile),
    kind: "primitive",
  };
}
