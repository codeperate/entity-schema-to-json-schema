import { EntityClass, EntitySchema, EntitySchemaMetadata } from '@mikro-orm/core';
import { JSONSchema } from 'json-schema-to-ts';

export interface EntitySchemas<Entity, Base, Meta, Schema extends JSONSchema> {
  meta: EntitySchemaMetadata<Entity, Base> & Meta;
  jsonSchema: Schema;
}

export function defineEntitySchemas<Schema extends JSONSchema, Meta extends EntitySchemaMetadata<any, any>>(
  meta: Meta,
  jsonSchema: Schema,
) {
  return {
    meta,
    entitySchema: new EntitySchema(meta),
    jsonSchema,
  } as EntitySchemas<ExtractEntityType<Meta['class']>, ExtractBase<Meta['extends']>, typeof meta, Schema>;
}

export type ExtractEntityType<T> = T extends EntityClass<infer U> ? U : never;
export type ExtractBase<T> = T extends EntitySchema<any, infer U> ? U : never;
