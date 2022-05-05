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
  return db.createTable('orders', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: 'datetime',
      notNull: true
    },
    order_total: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    order_status_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'orders_order_status_fk',
        table: 'order_status',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    user_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'orders_user_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
  })
};

exports.down = function (db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
