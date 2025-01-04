import assert from 'assert';
import { describe, it } from 'node:test';
import { JSONSchema } from 'json-schema-to-ts';
import { entitySchemaBuilder } from '../entity-schema-builder.js';

// type User = {
//   name: string;
//   age: number;
//   email: string;
//   address: {
//     street: string;
//     city: string;
//   };
// };

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer' },
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
  required: ['name', 'age', 'email', 'address'],
} satisfies JSONSchema;
describe('entitySchemaBuilder fks functionality', () => {
  it('should pick the address property and convert it to a foreign key', () => {
    const fksSchema = entitySchemaBuilder(schema, ['address']).fKs().schema;
    assert.deepStrictEqual(fksSchema, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        email: { type: 'string' },
        address: {
          type: 'string',
        },
      },
      required: ['name', 'age', 'email', 'address'],
    });
  });
});
