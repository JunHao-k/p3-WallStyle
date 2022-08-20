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
  return db.createTable('cart_items' , {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    dimension_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cart_item_dimension_fk',
        table: 'dimensions',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    frame_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cart_item_frame_fk',
        table: 'frames',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    variant_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cart_item_variant_fk',
        table: 'variants',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    account_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cart_item_account_fk',
        table: 'accounts',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
  });
};

exports.down = function(db) {
  return db.dropTable('cart_items');
};

exports._meta = {
  "version": 1
};
