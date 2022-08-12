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
  return db.createTable('variants' , {
    id:{
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    product_id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'variant_product_fk',
        table: 'products',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    model_name:{
      type: "string",
      length: 50
    },
    model_image:{
      type: "string",
      length: 2048
    },
    model_thumbnail:{
      type: "string",
      length: 2048
    },
    model_stock: 'int'
  });
};

exports.down = function(db) {
  return db.dropTable('variants');
};

exports._meta = {
  "version": 1
};
