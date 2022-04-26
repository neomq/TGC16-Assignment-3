'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('products', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: 'string',
      length: 2048,
      notNull: true
    },
    price: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    stock: {
      type: 'int',
      unsigned: true,
      notNull: true
    }
  })
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
