import { JSONSchema } from 'json-schema-to-ts';
import { EntitySchemas } from './define-entity-schemas.js';
import { EntitySchemaBuilder, entitySchemaBuilder } from './entity-schema-builder.js';
import { ReferenceKind } from '@mikro-orm/core';
import { ExtractKindKeys } from './type.js';

export const use = <Entity extends object, Base, Meta extends { properties? }, Schema extends JSONSchema>({
  jsonSchema,
  meta,
}: EntitySchemas<Entity, Base, Meta, Schema>) => {
  const foreignKeys = Object.entries<{ kind: ReferenceKind }>(meta.properties ?? {})
    .map(([key, { kind }]) =>
      [ReferenceKind.MANY_TO_MANY, ReferenceKind.MANY_TO_ONE, ReferenceKind.ONE_TO_ONE, ReferenceKind.ONE_TO_MANY].includes(kind)
        ? key
        : null,
    )
    .filter(Boolean) as ExtractKindKeys<Meta>[];
  return entitySchemaBuilder(jsonSchema, foreignKeys) as unknown as EntitySchemaBuilder<
    Entity,
    Schema,
    ExtractKindKeys<Meta['properties']>
  >;
};
