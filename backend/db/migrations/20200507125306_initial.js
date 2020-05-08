const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.dateTime('deleted_at');
}

function createNameTable(knex, table_name) {
  return knex.schema.createTable(table_name, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable().unique();
    addDefaultColumns(table);
  });
}

function references(table, tableName) {
  table
    .integer(tableName)
    .unsigned()
    .references('id')
    .inTable(tableName)
    .onDelete('cascade'); // this will delete all data linked with FK
}

function url(table, columnName) {
  table.string(columnName, 2000);
}

// must return so we can chain onto it
function email(table, columnName) {
  return table.string(columnName, 254);
}

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments().notNullable();
    email(table, 'email').notNullable().unique();
    table.string('name').notNullable();
    table.string('password', 127).notNullable();
    table.dateTime('last_login');
    addDefaultColumns(table);
  });

  await createNameTable(knex, tableNames.item_type);
  await createNameTable(knex, tableNames.country);
  await createNameTable(knex, tableNames.state);
  await createNameTable(knex, tableNames.shape);

  await knex.schema.createTable(tableNames.inventory_location, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable().unique();
    table.string('description', 1000);
    url(table, 'image_url');
    addDefaultColumns(table);
  });

  // FK relations to state_id and country_id
  await knex.schema.createTable(tableNames.address, (table) => {
    table.increments().notNullable();
    table.string('street_address_1', 50).notNullable();
    table.string('street_address_2', 50);
    table.string('city', 50).notNullable();
    table.string('zipcode', 15).notNullable();
    table.float('latitude').notNullable();
    table.float('longitude').notNullable();
    // FK relation
    references(table, 'state');
    references(table, 'country');
  });

  await knex.schema.createTable(tableNames.manufacturer, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.string('description', 1000);
    url(table, 'logo_url');
    url(table, 'website_url');
    email(table, 'email');
    references(table, 'address');
  });

  // TODO: create item table

};

exports.down = async (knex) => {
  await Promise.all([
    tableNames.manufacturer,
    tableNames.address,
    tableNames.user,
    tableNames.item_type,
    tableNames.country,
    tableNames.state,
    tableNames.shape,
    tableNames.inventory_location
  ].map(tablename => knex.schema.dropTable(tablename)));
};
