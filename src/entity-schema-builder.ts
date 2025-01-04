import { schemaBuilder, SchemaBuilder } from '@codeperate/json-schema-builder';
import { JSONSchema } from 'json-schema-to-ts';

export interface EntitySchemaBuilder<Type extends object, Schema extends JSONSchema, FK extends keyof any>
  extends SchemaBuilder<Type, Schema> {
  noFKs(): SchemaBuilder<Omit<Type, FK>, Schema>;
  fKs(): SchemaBuilder<Omit<Type, FK> & { [key in FK]: string }, Schema>;
}

export const entitySchemaBuilder = <Type extends object = any, Schema extends JSONSchema = any, FK extends keyof Type = any>(
  schema: Schema,
  foreignKeys: FK[],
) => {
  const builder = schemaBuilder<Type, Schema>(schema);
  return {
    ...builder,
    noFKs: () => builder.omit(foreignKeys),
    fKs: () => foreignKeys.reduce((b, key) => b.setPropsType(key as keyof Type, { type: 'string' }), builder),
  } as EntitySchemaBuilder<Type, Schema, FK>;
};
