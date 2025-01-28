export interface BuilderConfig {
  fksSchema: any;
}

export const builderConfig = {
  fksSchema: {
    type: 'string',
  },
};

export const configureEntitySchemaBuilder = (config: Partial<BuilderConfig>) => {
  Object.assign(builderConfig, config);
};
