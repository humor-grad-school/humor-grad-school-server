import Knex from 'knex';
import { Model } from 'objection';

// Initialize knex.
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: 'example.db'
  }
});

Model.knex(knex);

export async function init() {
  await knex.migrate.latest();
  console.log('up finished');
}
