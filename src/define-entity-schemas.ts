import { EntityClass, EntitySchema, EntitySchemaMetadata } from '@mikro-orm/core';
import { JSONSchema } from 'json-schema-to-ts';

export interface EntitySchemas<Entity, Base, Meta, Schema extends JSONSchema> {
  meta: EntitySchemaMetadata<Entity, Base> & Meta;
  jsonSchema: Schema;
}

export function defineEntitySchemas<
  Schema extends JSONSchema,
  Meta extends EntitySchemaMetadata<ExtractEntityType<Meta['class']>, ExtractBase<Meta['extends']>>,
>(meta: Meta, jsonSchema: Schema) {
  return {
    meta,
    entitySchema: new EntitySchema(meta),
    jsonSchema,
  } as EntitySchemas<ExtractEntityType<Meta['class']>, ExtractBase<Meta['extends']>, Meta, Schema>;
}

export type ExtractEntityType<T> = T extends EntityClass<infer U> | (Function & { prototype: infer U }) | undefined ? U : never;
export type ExtractBase<T> = T extends string | EntitySchema<infer U, never> | undefined ? U : never;
