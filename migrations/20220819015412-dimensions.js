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
  return db.createTable('dimensions' , {
    id:{
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    dimension_size:{
      type: 'string',
      length: 50
    },
    dimension_cost: 'int'
  });
};

exports.down = function(db) {
  return db.dropTable('dimensions');
};

exports._meta = {
  "version": 1
};
