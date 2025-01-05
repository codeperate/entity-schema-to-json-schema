import { schemaBuilder, SchemaBuilder } from '@codeperate/json-schema-builder';
import { JSONSchema } from 'json-schema-to-ts';

export interface EntitySchemaBuilder<Schema extends JSONSchema, Type extends object, FK extends keyof any>
  extends SchemaBuilder<Schema, Type> {
  noFKs(): SchemaBuilder<Schema, Omit<Type, FK>>;
  fKs(): SchemaBuilder<Schema, Omit<Type, FK> & { [key in FK]: string }>;
}

export const entitySchemaBuilder = <Schema extends JSONSchema = any, Type extends object = any, FK extends keyof Type = any>(
  schema: Schema,
  foreignKeys: FK[],
) => {
  const builder = schemaBuilder<Schema, Type>(schema);
  return {
    ...builder,
    noFKs: () => builder.omit(foreignKeys),
    fKs: () => foreignKeys.reduce((b, key) => b.setPropsType(key as keyof Type, { type: 'string' }), builder),
  } as EntitySchemaBuilder<Schema, Type, FK>;
};
