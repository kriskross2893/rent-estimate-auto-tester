import dotenv from 'dotenv';
import joi from 'joi';
import debugLib from 'debug';

if (process.env.NODE_ENV == null) {
  const config = dotenv.config();

  if (config.error) {
    throw config.error;
  }
}

if (process.env.NODE_ENV !== 'test') {
  const envVarSchema = joi.object({
    NODE_ENV: joi.string()
      .valid(['development', 'production'])
      .required(),
    HOST: joi.string()
      .required(),
    PORT: joi.number()
      .integer()
      .required(),
    CAST_SCHEMA: joi.string()
      .required(),
    POSTGRES_URL: joi.string()
      .required(),
    POSTGRES_SSL: joi.boolean()
      .truthy('TRUE')
      .truthy('true')
      .truthy('1')
      .truthy(1)
      .falsy('FALSE')
      .falsy('false')
      .falsy('0')
      .falsy(0)
      .default(false),
    DEBUG: joi.string()
      .default('*'),
    ALGOLIA_APP_ID: joi.string()
      .required(),
    ALGOLIA_INDEX: joi.string()
      .required(),
    ALGOLIA_CLIENT_API_KEY: joi.string()
      .required(),
  }).unknown()
    .required();

  const {error} = joi.validate(process.env, envVarSchema);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
}

debugLib.enable(process.env.DEBUG);
