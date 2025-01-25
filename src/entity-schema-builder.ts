import { schemaBuilder, SchemaBuilder } from '@codeperate/json-schema-builder';
import { JSONSchema } from 'json-schema-to-ts';

export interface EntitySchemaBuilder<Schema extends JSONSchema, Type extends object, FK extends keyof any, BP extends keyof any>
  extends SchemaBuilder<Schema, Type> {
  noFKs(): EntitySchemaBuilder<Schema, Omit<Type, FK>, FK, BP>;
  fKs(): EntitySchemaBuilder<Schema, Omit<Type, FK> & { [key in FK]: string }, FK, BP>;
  noBPs(): EntitySchemaBuilder<Schema, Omit<Type, BP>, FK, BP>;
  withType<T extends object>(type?: T): EntitySchemaBuilder<Schema, T, FK, BP>;
}

export const entitySchemaBuilder = <
  Schema extends JSONSchema = any,
  Type extends object = any,
  FK extends keyof Type = any,
  BP extends keyof Type = any,
>(
  schema: Schema,
  foreignKeys: FK[],
  baseProps?: BP[],
) => {
  const builder = schemaBuilder<Schema, Type>(schema);
  const newBuilder = {
    ...builder,
    noFKs() {
      return this.omit(foreignKeys);
    },
    fKs() {
      foreignKeys.forEach((fk) => {
        const type = this.schema['properties']?.[fk]?.type;
        if (!type) throw new Error(`Foreign key ${String(fk)} not found in schema`);
        else if (type === 'array')
          this.schema['properties'][fk] = {
            type: 'array',
            items: { type: 'string' },
          };
        else this.schema['properties']![fk] = { type: 'string' };
      });
      return this;
    },
    noBPs() {
      if (baseProps && baseProps.length > 0) return this.omit(baseProps!);
      return this;
    },
  };
  return newBuilder as unknown as EntitySchemaBuilder<Schema, Type, FK, BP>;
};
