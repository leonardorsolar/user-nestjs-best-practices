import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserRepository implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `);
  }

  create(name: string, email: string) {
    return this.db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [
      name,
      email,
    ]);
  }

  findAll() {
    return this.db.all(`SELECT * FROM users`);
  }

  findOne(id: number) {
    return this.db.get(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  update(id: number, name: string, email: string) {
    return this.db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [
      name,
      email,
      id,
    ]);
  }

  delete(id: number) {
    return this.db.run(`DELETE FROM users WHERE id = ?`, [id]);
  }
}
