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
  return db.createTable('accounts' , {
    id:{
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    role_id:{                                                   
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'account_role_fk',
        table: 'roles',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    email:{
      type: 'string',
      length: 320
    },
    password: {
      type: 'string',
      length: 200
    },
    first_name: {
      type: 'string',
      length: 100
    },
    last_name: {
      type: 'string',
      length: 100
    },
    created_date: 'date',
    modified_date: 'date'
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

/* 
  user_type_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'user_user_type_fk',
        table: 'user_types',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'user_type_id'
*/