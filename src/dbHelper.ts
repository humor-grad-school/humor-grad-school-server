import Knex from 'knex';
import { Model } from 'objection';
const knexFile = require('../knexfile');

// Initialize knex.
export const knex = Knex(knexFile[process.env.NODE_ENV]);

Model.knex(knex);

export async function init() {
  await knex.migrate.latest();
  console.log('up finished');
}
