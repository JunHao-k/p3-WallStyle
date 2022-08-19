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
  return db.createTable('frames' , {
    id:{
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    frame_type:{
      type: 'string',
      length: 50
    },
    frame_cost: 'int'
  });
};

exports.down = function(db) {
  return db.dropTable('frames');
};

exports._meta = {
  "version": 1
};
