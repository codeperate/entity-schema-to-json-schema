import { EntityClass, EntitySchema, EntitySchemaMetadata } from '@mikro-orm/core';
import { JSONSchema } from 'json-schema-to-ts';
import { addEntitySchemas } from './schema-storage.js';

export interface EntitySchemasOption<BaseProps extends keyof any = any> {
  baseProps?: BaseProps[];
}
export interface EntitySchemas<
  Entity = any,
  Base = any,
  Meta = any,
  Schema extends JSONSchema = any,
  Option extends EntitySchemasOption<any> = any,
> {
  meta: EntitySchemaMetadata<Entity, Base> & Meta;
  jsonSchema: Schema;
  option: Option;
}

export function defineEntitySchemas<
  Schema extends JSONSchema,
  Meta extends EntitySchemaMetadata<ExtractEntityType<Meta['class']>, ExtractBase<Meta['extends']>>,
  Option extends EntitySchemasOption<any>,
>(meta: Meta, jsonSchema: Schema, option?: Option) {
  addEntitySchemas(meta!.name! || meta!.class!.name, { meta, jsonSchema, option });
  const entitySchemas = {
    meta,
    entitySchema: new EntitySchema(meta),
    jsonSchema,
    option,
  } as EntitySchemas<ExtractEntityType<Meta['class']>, ExtractBase<Meta['extends']>, Meta, Schema, Option>;
  return entitySchemas;
}

export type ExtractEntityType<T> = T extends EntityClass<infer U> | (Function & { prototype: infer U }) | undefined ? U : never;
export type ExtractBase<T> = T extends string | EntitySchema<infer U, never> | undefined ? U : never;
