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
  return db.createTable('products_themes' , {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    product_id:{
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'products_themes_product_fk',
        table: 'products',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    theme_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'products_themes_theme_fk',
        table: 'themes',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('products_themes');
};

exports._meta = {
  "version": 1
};
