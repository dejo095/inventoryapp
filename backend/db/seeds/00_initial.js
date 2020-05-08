const Knex = require('knex');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const tableNames = require('../../src/constants/tableNames');
const orderedTableNames = require('../../src/constants/orderedTableNames');

// seeds all run, and in alfabetical order

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {

  await orderedTableNames.reduce(async (promise, table_name) => {
    await promise;
    console.log('Clearing ', table_name);
    return knex(table_name).del()
  }, Promise.resolve())

  const password = crypto.randomBytes(15).toString('hex');

  const user = {
    email: 'somebody@domain.com',
    name: 'somebody',
    password: await bcrypt.hash(password, 12)
  }

  // can return multiple users thats why we destructure it
  const [createdUser] = await knex(tableNames.user).insert(user).returning('*');

  console.log('User created: ', password, createdUser); // possibly {password}


  // country
  await knex(tableNames.country).insert([
    {
      name: 'US'
    },
    {
      name: 'BE'
    }
  ]);

  // state
  await knex(tableNames.state).insert([
    {
      name: 'CO'
    }
  ]);
};
