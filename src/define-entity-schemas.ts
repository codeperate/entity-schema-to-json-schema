import { EntitySchema, EntitySchemaMetadata } from '@mikro-orm/core';
import { JSONSchema } from 'json-schema-to-ts';

export interface EntitySchemas<Entity, Base, Meta, Schema extends JSONSchema> {
  meta: EntitySchemaMetadata<Entity, Base> & Meta;
  jsonSchema: Schema;
}

export function defineEntitySchemas<Entity extends object, Base, Meta, Schema extends JSONSchema>(
  meta: EntitySchemaMetadata<Entity, Base> & Meta,
  jsonSchema: Schema,
) {
  return {
    meta,
    entitySchema: new EntitySchema(meta),
    jsonSchema,
  } as EntitySchemas<Entity, Base, Meta, Schema>;
}
