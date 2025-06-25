import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.connection;
  }

  create(createUserDto: CreateUserDto) {
    const { name, email } = createUserDto;
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO users (name, email) VALUES (?, ?)`,
        [name, email],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, email });
        },
      );
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  findOne(id: number) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const { name, email } = updateUserDto;
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, id],
        function (err) {
          if (err) reject(err);
          else resolve({ id, name, email });
        },
      );
    });
  }

  remove(id: number) {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }
}
