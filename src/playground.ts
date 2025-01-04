import { BaseEntity as ORMBaseEntity } from '@mikro-orm/core';

import { EntitySchema, ObjectId } from '@mikro-orm/mongodb';
import { defineEntitySchemas } from './define-entity-schemas.js';
import { use } from './use.js';
import { ExtractKindKeys } from './type.js';

export class BaseEntity extends ORMBaseEntity {
  _id!: ObjectId;
  createdAt!: Date;
  updatedAt!: Date;
}

export class User {
  name!: string;
  email!: string;
  jobs!: Job[];
}

export const BaseEntitySchema = new EntitySchema<BaseEntity>({
  name: 'BaseEntity',
  class: BaseEntity,
  properties: {
    _id: { type: 'ObjectId' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
});

export class Job {
  title!: string;
  description!: string;
  salary!: number;
  createdBy!: User;
}

export const JobEntitySchema = new EntitySchema({
  name: 'Job',
  class: Job,
  extends: BaseEntitySchema,
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    salary: { type: 'number' },
    createdBy: { kind: 'm:1', entity: () => User, inversedBy: () => User },
  },
});

export const JobSchema = {
  name: 'Job',
  class: Job,
  extends: BaseEntitySchema,
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    salary: { type: 'number' },
    createdBy: { kind: 'm:1', entity: () => User, inversedBy: () => User },
  },
} as const;

type d = ExtractKindKeys<(typeof JobSchema)['properties']>;
const JobSchemas = defineEntitySchemas(
  {
    class: Job,
    extends: BaseEntitySchema,
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      salary: { type: '' },
      createdBy: { kind: 'm:1', entity: () => User, inversedBy: () => User },
      // updatedBy: { kind: 'm:1', entity: () => User, inversedBy: () => User },
    },
  },
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
      createdBy: {
        type: 'object',
      },
    },
  },
);

const a = use(JobSchemas).pick([]);
type c = typeof a;
