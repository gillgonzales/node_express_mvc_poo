import pg from 'pg';
const { Pool } = pg;

export class Database {
  static instance = null;

  constructor() {
    if (Database.instance) return Database.instance;
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'app_db',
      user: process.env.DB_USER || 'app_user',
      password: process.env.DB_PASSWORD || 'app_password',
      max: 10
    });
    Database.instance = this;
  }

  static getInstance() { return Database.instance || new Database(); }
  async query(sql, params = []) { return this.pool.query(sql, params); }
}