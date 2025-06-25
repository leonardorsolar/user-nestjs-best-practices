import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database } from 'sqlite3';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database;

  onModuleInit() {
    this.db = new Database('./database.sqlite', (err) => {
      if (err) {
        console.error('Erro ao conectar no SQLite:', err.message);
      } else {
        console.log('✅ Conectado ao SQLite');
        this.createTable();
      }
    });
  }

  private createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `);
  }

  get connection(): Database {
    return this.db;
  }
}
