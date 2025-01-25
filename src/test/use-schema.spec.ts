import assert from 'assert';
import { describe, it } from 'node:test';
import { JSONSchema } from 'json-schema-to-ts';
import { entitySchemaBuilder } from '../entity-schema-builder.js';
import { defineEntitySchemas } from '../define-entity-schemas.js';
import { useSchema } from '../use-schema.js';

class User {
  id: string;
  name: string;
  age: number;
  email: string;
  address: {
    street: string;
    city: string;
  };
}
const userSchemas = defineEntitySchemas(
  {
    name: 'User',
    class: User,
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      age: { type: 'integer' },
      email: { type: 'string' },
      address: {
        type: 'object',
      },
    },
  },
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      age: { type: 'number' },
      email: { type: 'string' },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
        },
        required: ['street', 'city'],
      },
    },
  },
  {
    baseProps: ['id'],
  },
);
describe.only('entitySchemaBuilder fks functionality', () => {
  it.only('should omit base properties', () => {
    const { typedSchema } = useSchema(userSchemas).noBPs().fKs().omit(['name']);
    console.log(JSON.stringify(typedSchema, null, 2));
    assert.deepStrictEqual(typedSchema, {
      type: 'object',
      properties: {
        age: {
          type: 'number',
        },
        email: {
          type: 'string',
        },
        address: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
          },
          required: ['street', 'city'],
        },
      },
    });
  });
});
