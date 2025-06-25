# Conhecimento de ORM

## 🧠 O que é um **banco de dados com e sem ORM**?

### ✅ **Banco de dados com ORM (Object-Relational Mapping)**

👉 Você **não escreve SQL** diretamente.
👉 Em vez disso, você usa **objetos e classes** que representam tabelas e registros do banco.

### Exemplo (com ORM):

```ts
const user = await userRepository.findOne({ where: { id: 1 } });
```

> Aqui você usa **métodos de um objeto**, não escreve `SELECT * FROM users`.

#### Ferramentas ORM populares:

- **TypeORM** (NestJS, Node.js)
- **Prisma** (moderno e tipado)
- **Hibernate** (Java)
- **Entity Framework** (C#)

---

### 🚫 **Banco de dados sem ORM**

👉 Você escreve **SQL puro** (manualmente).
👉 Você tem mais controle, mas precisa lidar com **queries, conexões e erros** por conta própria.

### Exemplo (sem ORM):

```ts
db.get('SELECT * FROM users WHERE id = ?', [1], (err, row) => {
  console.log(row);
});
```

> Aqui você escreve a SQL completa e trata o retorno manualmente.

---

## 🆚 Diferença simples:

| Aspecto              | Com ORM                                   | Sem ORM                          |
| -------------------- | ----------------------------------------- | -------------------------------- |
| Linguagem            | Classe e métodos (`.find()`)              | SQL puro (`SELECT ...`)          |
| Curva de aprendizado | Mais fácil para iniciantes                | Mais controle, mais complexidade |
| Produtividade        | Alta (menos código manual)                | Média/baixa (mais código)        |
| Performance          | Boa (com tuning), mas pode esconder o SQL | Máxima transparência             |
| Erros                | Tratados por abstração                    | Você trata tudo                  |

---

## 🧪 Quando usar qual?

- ✅ **Use ORM** se você quer **rapidez para desenvolver**, foco em regras de negócio e produtividade.
- ✅ **Use sem ORM** se você quer **total controle**, simplicidade ou está em projeto pequeno.

---

# Banco de Dados com ORM:

Banco de dados com ORM (Object-Relational Mapping)
👉 Você não escreve SQL diretamente.
👉 Em vez disso, você usa objetos e classes que representam tabelas e registros do banco.

# Savar os dados no banco de dados no banco Mysql com uma orm: TypeORM ou PRISMA

Abaixo os dois tutoriais para sua escolha:

# Savar os dados no banco de dados no banco Mysql com uma orm:TypeORM

Perfeito! Agora vamos transformar o seu código para **salvar os dados no banco de dados MySQL** usando o **TypeORM**, que é a ferramenta oficial suportada pelo NestJS para integração com bancos relacionais.

---

## ✅ Etapas para salvar no MySQL com NestJS

### 🧰 1. Instale o TypeORM e o driver do MySQL

```bash
npm install @nestjs/typeorm typeorm mysql2
```

---

### 🛠️ 2. Configure o banco de dados no NestJS

Abra `src/app.module.ts` e configure a conexão com seu banco MySQL:

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'seu_usuario',
      password: 'sua_senha',
      database: 'seu_banco',
      entities: [User],
      synchronize: true, // cria tabelas automaticamente (use só em dev)
    }),
    UserModule,
  ],
})
export class AppModule {}
```

> Substitua `seu_usuario`, `sua_senha` e `seu_banco` pelos dados reais do seu MySQL.

---

### 🧱 3. Atualize a `User` entity para mapear a tabela

Abra `src/user/entities/user.entity.ts`:

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```

---

### 🧩 4. Atualize `UserModule` para importar o repositório do TypeORM

Em `src/user/user.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

---

### 🧠 5. Atualize `UserService` para usar o banco (MySQL)

Altere `src/user/user.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.remove(user);
    }
    return user;
  }
}
```

---

## ✅ Pronto! Agora funciona com o MySQL.

### 🧪 Teste com `curl`

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@email.com"}'
```

```bash
curl http://localhost:3000/user
```

---

## 🧠 Por que isso funciona?

- **TypeORM** mapeia a classe `User` para uma **tabela no banco de dados**.
- O `UserService` usa `Repository<User>` para criar, buscar, atualizar e deletar usuários.
- O `synchronize: true` faz com que o Nest crie as tabelas automaticamente com base nas entidades.

---

Se quiser, posso te ajudar a:

- Adicionar validação nos DTOs com `class-validator`
- Usar migrations (ao invés de `synchronize: true`)
- Criar relacionamento entre tabelas (ex: `user` e `posts`)

# Savar os dados no banco de dados no banco Mysql com um orm: PRISMA

Perfeito! Vamos usar o **Prisma** com o NestJS para salvar os usuários no **MySQL**. O Prisma é um ORM moderno, com tipagem forte e integração excelente com TypeScript.

---

## ✅ Objetivo:

Fazer o seu CRUD `/user` funcionar com **MySQL e Prisma**.

---

## 📦 1. Instalar o Prisma e o driver MySQL

```bash
npm install prisma --save-dev
npm install @prisma/client
npm install @nestjs/config
```

---

## ⚙️ 2. Inicializar o Prisma

```bash
npx prisma init
```

> Isso vai criar:

```
prisma/
  └── schema.prisma
.env
```

---

## 🧬 3. Configurar o banco no `.env`

Edite o arquivo `.env`:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
```

Exemplo:

```env
DATABASE_URL="mysql://root:root@localhost:3306/nest_prisma"
```

---

## 📐 4. Criar o modelo `User` no Prisma

Abra `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

---

## 🛠️ 5. Criar as tabelas no MySQL

```bash
npx prisma db push
```

> Isso cria a tabela `User` no banco de dados.

---

## 🔧 6. Gerar cliente do Prisma

```bash
npx prisma generate
```

---

## 🧩 7. Criar um módulo `PrismaModule` no Nest

```bash
nest g module prisma
nest g service prisma
```

### `src/prisma/prisma.service.ts`:

```ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

### `src/prisma/prisma.module.ts`:

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 👤 8. Atualizar `UserService` para usar o Prisma

### 1. Primeiro, importe o módulo Prisma:

Em `app.module.ts`:

```ts
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, UserModule],
})
export class AppModule {}
```

---

### 2. Altere `src/user/user.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
```

---

## 📦 9. Ajustar o DTO

### `create-user.dto.ts`:

```ts
export class CreateUserDto {
  name: string;
  email: string;
}
```

---

## ✅ Testar com `curl`

### Criar:

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@email.com"}'
```

### Listar:

```bash
curl http://localhost:3000/user
```

---

## 🧠 Resumo

| Etapa                 | Ferramenta   | Resultado                                       |
| --------------------- | ------------ | ----------------------------------------------- |
| ORM                   | Prisma       | Geração de modelo e conexão                     |
| Banco de dados        | MySQL        | Dados persistem em disco                        |
| Integração com NestJS | PrismaModule | Prisma injetado com DI (Injeção de Dependência) |
| Controle de acesso    | DTOs         | Define e valida os dados de entrada             |

---

Proximos passos: mostrar como adicionar validações com `class-validator` ou como gerar migrations com o Prisma. Deseja seguir com isso?
