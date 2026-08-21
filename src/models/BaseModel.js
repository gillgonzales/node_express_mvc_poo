import { Database } from '../config/Database.js';

export class BaseModel {
  constructor({ table, primary = 'id' } = {}) {
    this.db = Database.getInstance();
    this.table = table;
    this.primary = primary;
  }

  async query(sql, params = []) { return this.db.query(sql, params); }

  quoteIdentifier(identifier) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error(`Identificador SQL inválido: ${identifier}`);
    }
    return `"${identifier}"`;
  }

  selectColumns(columns = []) {
    return columns.length
      ? columns.map((column) => this.quoteIdentifier(column)).join(', ')
      : '*';
  }

  async select(columns = []) {
    const result = await this.query(
      `SELECT ${this.selectColumns(columns)} FROM ${this.quoteIdentifier(this.table)}`
    );
    return result.rows;
  }

  async selectById(id, columns = []) {
    const result = await this.query(
      `SELECT ${this.selectColumns(columns)} FROM ${this.quoteIdentifier(this.table)} WHERE ${this.quoteIdentifier(this.primary)} = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async insert(attributes) {
    const entries = Object.entries(attributes);
    if (!entries.length) throw new Error('Nenhum atributo informado para inserção.');
    const columns = entries.map(([column]) => this.quoteIdentifier(column)).join(', ');
    const params = entries.map((_, index) => `$${index + 1}`).join(', ');
    const result = await this.query(
      `INSERT INTO ${this.quoteIdentifier(this.table)} (${columns}) VALUES (${params}) RETURNING *`,
      entries.map(([, value]) => value)
    );
    return result.rows[0];
  }

  async update(id, attributes) {
    const entries = Object.entries(attributes).filter(([column]) => column !== this.primary);
    if (!entries.length) throw new Error('Nenhum atributo informado para atualização.');
    const assignments = entries.map(([column], index) => `${this.quoteIdentifier(column)} = $${index + 1}`).join(', ');
    const result = await this.query(
      `UPDATE ${this.quoteIdentifier(this.table)} SET ${assignments} WHERE ${this.quoteIdentifier(this.primary)} = $${entries.length + 1} RETURNING *`,
      [...entries.map(([, value]) => value), id]
    );
    return result.rows[0] || null;
  }

  async destroy(id) {
    const result = await this.query(
      `DELETE FROM ${this.quoteIdentifier(this.table)} WHERE ${this.quoteIdentifier(this.primary)} = $1`,
      [id]
    );
    return result.rowCount > 0;
  }

  async filter(filters, columns = []) {
    const entries = Object.entries(filters);
    if (!entries.length) return this.select(columns);
    const conditions = entries.map(([column], index) => `${this.quoteIdentifier(column)} ILIKE $${index + 1}`).join(' AND ');
    const result = await this.query(
      `SELECT ${this.selectColumns(columns)} FROM ${this.quoteIdentifier(this.table)} WHERE ${conditions}`,
      entries.map(([, value]) => `%${value}%`)
    );
    return result.rows;
  }

  findAll(columns = []) { return this.select(columns); }
  findById(id, columns = []) { return this.selectById(id, columns); }
  create(attributes) { return this.insert(attributes); }
  delete(id) { return this.destroy(id); }
}