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

exports.up = function(db) {
  return db.createTable('orders' , {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    total_cost:{
      type: 'int',
      unsigned: true,
      notNull: true
    },
    payment_type: {
      type: 'string',
      length: 80,
      notNull: true
    },
    receipt_url:{
      type: 'string',
      length: 2048,
      notNull: true
    },
    order_date: {
      type: 'datetime',
      notNull: true
    },
    payment_reference: {
      type: 'string',
      length: 150,
      notNull: true
    },
    billing_country: {
      type: 'string',
      length: 5,
      notNull: true
    },
    billing_address_1: {
      type: 'string',
      length: 150,
      notNull: true
    },
    billing_address_2: {
      type: 'string',
      length: 150,
      notNull: false
    },
    billing_postal_code: {
      type: 'string',
      length: 10,
      notNull: true
    },
    shipping_country: {
      type: 'string',
      length: 5,
      notNull: true
    },
    shipping_address_1: {
      type: 'string',
      length: 150,
      notNull: true
    },
    shipping_address_2: {
      type: 'string',
      length: 150,
      notNull: false
    },
    shipping_postal_code: {
      type: 'string',
      length: 10,
      notNull: true
    },
    account_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'order_account_fk',
        table: 'accounts',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    order_status_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: 'order_order_status_fk',
        table: 'order_status',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
