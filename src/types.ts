export type FieldKind = "primitive" | "relation" | "enum";

export type Field = {
  name: string;
  type: string;
  kind: FieldKind;
  isArray: boolean;
  isOptional: boolean;
};

export type Entity = {
  name: string;
  fields: Field[];
};
