## 📘 Projeto: API com Frontend e Backend em NestJS

Para instalar as dependências e subir o servidor, segue:

### 📥 Clonando o projeto via GitHub

Para baixar e executar este projeto em sua máquina local:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# Acesse a pasta do projeto
cd seu-repositorio

# Instale o Nest de forma global
npm i -g @nestjs/cli

# Instale as dependências
npm install

# Inicie o projeto em modo de desenvolvimento
npm run start:dev
```

> 🔁 Substitua `seu-usuario/seu-repositorio` pela URL real do seu repositório no GitHub.

---

### 🌐 Acessando o projeto

- Acesse o frontend: [http://localhost:3000/index.html](http://localhost:3000/index.html)
- API disponível em: [http://localhost:3000/user](http://localhost:3000/user)

---

# Melhores práticas:

Agora vamos analisar **oportunidades de melhoria** com foco em **boas práticas do NestJS e padrões de projeto**.

---

## ✅ **Oportunidades de melhoria**

Ótimo! Vamos aplicar as **melhores práticas** passo a passo no seu código. A ideia é:

1. ✅ **Melhorar o `DatabaseService`** para encapsular o SQLite.
2. ✅ **Criar um `UserRepository`** para separar a lógica de persistência.
3. ✅ **Deixar o `UserService` limpo**, focado em regras de negócio.
4. ✅ **Separar a criação da tabela para dentro do `UserRepository`**.

---

## 📁 Estrutura anterior

https://github.com/leonardorsolar/user-nestjs

```
src/
│
├── database/
│   ├── database.module.ts
│   └── database.service.ts ✅
│
├── user/
│   ├── dto/
│   ├── user.controller.ts
│   ├── user.service.ts ✅
│   └── user.module.ts
```

## 📁 Estrutura Final Recomendada

```
src/
│
├── database/
│   ├── database.module.ts
│   └── database.service.ts ✅
│
├── user/
│   ├── dto/
│   ├── user.controller.ts
│   ├── user.service.ts ✅
│   ├── user.repository.ts ✅
│   └── user.module.ts
```

---

Perfeito, vamos fazer a **primeira refatoração passo a passo**, com base nas **melhores práticas do NestJS**.

---

## ✅ Refatoração 1: Separação de Responsabilidades + Encapsulamento do SQLite

## 📌 Antes da refatoração:

O `UserService`:

- Faz SQL diretamente
- Está muito acoplado ao SQLite
- Fica difícil de testar
- Mistura lógica de negócio com persistência

---

### Código:`UserService`

### 1. **Evitar expor a conexão diretamente (`connection`)**

- **Por quê?** O `user.service.ts` está dependendo de SQL. A conexão direta (`this.databaseService.connection`) acopla o `UserService` à implementação específica (SQLite).
- **Melhoria:** Abstrair o acesso via métodos como `run()`, `get()`, `all()` dentro do `DatabaseService`.

### 3. **Evitar repetição de Promises** dentro do `UserService`

- **Por quê?** Muitos blocos repetem `new Promise(...)` para operações com `run`, `get`, `all`.
- **Melhoria:** Criar métodos reutilizáveis no `DatabaseService`:

  ```ts
  run(sql: string, params: any[]): Promise<any>
  get(sql: string, params: any[]): Promise<any>
  all(sql: string, params: any[]): Promise<any[]>
  ```

---

### 🎯 Objetivo:

- Tirar o SQL de dentro do `UserService`
- Parar de usar `connection` diretamente
- Criar uma classe `UserRepository` que interage com o banco de dados
- `UserService` foca só em **regras de negócio**

---

## 🔧 Etapas da refatoração

### 🧠 Refatoração 1

### 🧱 Crie o arquivo `user.repository.ts`

**Usar um `UserRepository`**

- **Por quê?** O `UserService` está lidando diretamente com SQL. Isso mistura **lógica de negócio** e **lógica de persistência**.
- **Melhoria:** Criar um `UserRepository` para encapsular os acessos ao banco. Assim, o `UserService` foca em regras e orquestrações.

Copie o código abaixo e cole no arquivo criado:

```ts
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

  async create(name: string, email: string) {
    const result = await this.db.run(
      `INSERT INTO users (name, email) VALUES (?, ?)`,
      [name, email],
    );
    return { id: result.lastID, name, email };
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
```

---

### 🧠 Refatoração 2:

- Separação de Responsabilidades + Encapsulamento do SQLite
- Atualize o `UserService` para usar o `UserRepository`

**Evitar expor a conexão diretamente (`connection`)**

- **Por quê?** A conexão direta (`this.databaseService.connection`) acopla o `UserService` à implementação específica (SQLite).
- **Melhoria:** Abstrair o acesso via métodos como `run()`, `get()`, `all()` dentro do `DatabaseService`.

## 3. 🧠 `user.service.ts` (limpo e com responsabilidade de regra de negócio)

```ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto.name, createUserDto.email);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      id,
      updateUserDto.name,
      updateUserDto.email,
    );
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
```

---

### 🧠 Refatoração 3:

### 🧩 Atualize o `user.module.ts` para registrar o novo `UserRepository`

```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
```

---

### 🗂️ Atualizar o `DatabaseService` para ter métodos genéricos

Tornar DatabaseService mais genérico
**Evitar repetição de Promises**

- **Por quê?** Muitos blocos repetem `new Promise(...)` para operações com `run`, `get`, `all`.
- **Melhoria:** Criar métodos reutilizáveis no `DatabaseService`:

  ```ts
  run(sql: string, params: any[]): Promise<any>
  get(sql: string, params: any[]): Promise<any>
  all(sql: string, params: any[]): Promise<any[]>
  ```

**Separar responsabilidade de criação de tabelas**

- **Por quê?** O `DatabaseService` está misturando **inicialização do banco** com **criação de tabela de usuário**, que é específica do domínio `User`.
- **Melhoria:** Criar um `UserRepository` ou `UserModule` que garanta que a tabela `users` exista. Pode usar `onModuleInit()` nesse contexto.

```ts
@Injectable()
export class DatabaseService {
  private db: Database;

  onModuleInit() {
    this.db = new Database('./database.sqlite', (err) => {
      if (err) console.error('Erro ao conectar no SQLite:', err.message);
      else {
        console.log('✅ Conectado ao SQLite');
        this.createUserTable();
      }
    });
  }

  private createUserTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `);
  }

  run(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID });
      });
    });
  }

  all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}
```

---

## ✅ Resultado final:

| Camada            | Responsabilidade                          |
| ----------------- | ----------------------------------------- |
| `UserController`  | Lida com requisições HTTP                 |
| `UserService`     | Orquestra ações, aplica regras de negócio |
| `UserRepository`  | Executa comandos SQL                      |
| `DatabaseService` | Abstrai a conexão e execução do SQLite    |

---

### Benefícios:

- Código **mais limpo e organizado**
- `UserService` fica **mais fácil de testar**
- Possível trocar SQLite por outro banco no futuro
- Melhor uso das **boas práticas do NestJS**

---

Se quiser, posso te mostrar como ficaria a estrutura com essas melhorias implementadas. Deseja ver esse exemplo?

---
