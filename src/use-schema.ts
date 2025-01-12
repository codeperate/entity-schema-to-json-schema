import { JSONSchema } from 'json-schema-to-ts';
import { EntitySchemas, EntitySchemasOption } from './define-entity-schemas.js';
import { EntitySchemaBuilder, entitySchemaBuilder } from './entity-schema-builder.js';
import { ReferenceKind } from '@mikro-orm/core';
import { ExtractKindKeys } from './type.js';

type ExtractBaseProps<Option> = Option extends { baseProps: (infer BaseProps)[] } ? BaseProps : never;

export const useSchema = <
  Entity extends object,
  Base,
  Meta extends { properties? },
  Schema extends JSONSchema,
  Option extends EntitySchemasOption,
>({
  jsonSchema,
  meta,
  option,
}: EntitySchemas<Entity, Base, Meta, Schema, Option>) => {
  const foreignKeys = Object.entries<{ kind: ReferenceKind }>(meta.properties ?? {})
    .map(([key, { kind }]) =>
      [ReferenceKind.MANY_TO_MANY, ReferenceKind.MANY_TO_ONE, ReferenceKind.ONE_TO_ONE, ReferenceKind.ONE_TO_MANY].includes(kind)
        ? key
        : null,
    )
    .filter(Boolean) as ExtractKindKeys<Meta>[];
  return entitySchemaBuilder(jsonSchema, foreignKeys, option.baseProps ?? []) as unknown as EntitySchemaBuilder<
    Schema,
    Entity,
    ExtractKindKeys<Meta['properties']>,
    ExtractBaseProps<Option>
  >;
};
