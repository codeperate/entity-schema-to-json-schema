import { EntitySchemas } from './define-entity-schemas.js';

const schemasMap = new Map<string, EntitySchemas>();

export function addEntitySchemas(name: string | { new (...args: any[]): any }, schemas: EntitySchemas) {
  const key = typeof name === 'string' ? name : name.name;
  schemasMap.set(key, schemas);
}

export function getEntitySchemas(name: string | { new (...args: any[]): any }) {
  const key = typeof name === 'string' ? name : name.name;
  return schemasMap.get(key);
}

export function getAllEntitySchemas() {
  return schemasMap;
}
