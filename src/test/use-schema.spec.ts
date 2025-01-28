import assert from 'assert';
import { describe, it } from 'node:test';
import { defineEntitySchemas } from '../define-entity-schemas.js';
import { useSchema } from '../use-schema.js';
import { Collection } from '@mikro-orm/core';

class User {
  id: string;
  name: string;
  age: number;
  email: string;
  address: {
    street: string;
    city: string;
  };
  friends = new Collection<User>(this);
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
      friends: {
        kind: 'm:1',
        entity: () => User,
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
      friends: {
        type: 'array',
        items: {},
      },
    },
  },
  {
    baseProps: ['id'] as const,
  },
);
describe.only('entitySchemaBuilder fks functionality', () => {
  it.only('should omit base properties', () => {
    const { typedSchema } = useSchema(userSchemas).noBPs().fKs().omit(['name']);
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
