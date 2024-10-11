// src/config/database.js

const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: '135.181.217.49',
      user:'knowledg_user',
      password:'jid@123@jid',
      database: 'knowledg_Demo',
      multipleStatements: true,
    });
  }

  async query(sql, params) {
    try {
      const rows = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error(error);
      throw 'Database query error';
    }
  }
}

module.exports = new Database();
