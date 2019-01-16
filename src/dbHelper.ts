import Knex from 'knex';
import { Model } from 'objection';
import BoardModel from './Model/BoardModel';
const knexFile = require('../knexfile');

// Initialize knex.
export const knex = Knex(knexFile[process.env.NODE_ENV]);

Model.knex(knex);

export async function init() {
  await knex.migrate.latest();
  try {
    await BoardModel.query().insert([{
      name: 'humor',
    }]);
  } catch(err) {

  }
  console.log('up finished');
}
