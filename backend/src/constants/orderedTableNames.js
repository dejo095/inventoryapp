const tableNames = require('./tableNames');

// sorted in order of dependency so we can drop in proper order

module.exports = [
    tableNames.item_type,
    tableNames.manufacturer,
    tableNames.address,
    tableNames.state,
    tableNames.country,
    tableNames.shape,
    tableNames.inventory_location,
    tableNames.user
];
