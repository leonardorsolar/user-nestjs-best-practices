# Clean Architecture 🏛️🚀

---

## Introdução 🎉

A arquitetura limpa (Clean Architecture) é um padrão de arquitetura de software que visa criar sistemas altamente testáveis, escaláveis e independentes de frameworks. Neste artigo, vamos explorar como aplicar os princípios da Clean Architecture em um projeto usando o framework NestJS.

---

## O que é Clean Architecture? 🤔📘

A Clean Architecture, proposta por _Robert C. Martin_, enfatiza a separação de preocupações e a independência de frameworks. Ela consiste em várias camadas concêntricas, cada uma com uma responsabilidade específica. As camadas principais são:

- **Entities (Entidades)**: Representam os objetos de negócio do sistema.
- **Use Cases (Casos de Uso)**: Implementam as regras de negócio do sistema.
- **Interfaces**: São interfaces que definem como os Use Cases interagem com o mundo externo.
- **Frameworks e Drivers**: São as camadas externas que interagem com o sistema, como frameworks web, bancos de dados, etc.

---

## Implementação 🛠️🐦

## Estrutura de Pastas 📁🔍

```js
src/
├── modules/
│   ├── users/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.ts
│   │   │   └── services/
│   │   │       └── user.service.ts
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   │   └── create-user.dto.ts
│   │   │   ├── interfaces/
│   │   │   │   └── user.interface.ts
│   │   │   └── use-cases/
│   │   │       └── create-user.use-case.ts
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   │       └── user.persistence.module.ts
│   │   └── presentation/
│   │       ├── controllers/
│   │       │   └── user.controller.ts
│   │       ├── dtos/
│   │       │   └── user.dto.ts
│   │       └── view-models/
│   │           └── user.view-model.ts
```

---

## Descrição das Pastas 📁🔍

- **Domain**: Aqui moram as entidades, repositórios e serviços relacionados ao coração do módulo.
- **Application**: Este é o cérebro do nosso módulo, onde os casos de uso, interfaces e DTOs fazem a mágica acontecer.
- **Infrastructure**: Este é o alicerce do nosso projeto, onde implementamos os detalhes de infraestrutura, como módulos de persistência.
- **Presentation**: Aqui é a hora do show! Contém os controladores, DTOs e view models que dão vida à nossa aplicação.

---

## Conclusão 🎉🚀

A Clean Architecture oferece uma maneira estruturada e modular de desenvolver aplicativos, promovendo a testabilidade, a escalabilidade e a manutenibilidade do código. Ao seguir os princípios da Clean Architecture, você pode construir sistemas mais robustos e independentes de frameworks.

# Clean Architecture com o Nest 🏛️🚀

# O que é Clean Architecture? 🏛️

Clean Architecture é uma filosofia de design introduzida por **Robert C. Martin (Uncle Bob)** que enfatiza:

- **Separação de responsabilidades**
- **Independência de frameworks**
- **Facilidade de testes**

O princípio central é estruturar sua aplicação de forma que a lógica de negócio esteja **desacoplada** de preocupações externas como frameworks, bancos de dados e interface do usuário.

---

## Por que NestJS? 🚀

**NestJS** é um framework progressivo para Node.js, construído com TypeScript e fortemente inspirado no Angular. Ele oferece:

- Uma **estrutura modular**
- **Injeção de dependência**
- **Decorators e reflexão de metadados**

Tudo isso se alinha perfeitamente com os objetivos da **Clean Architecture**.

---

## 1. Defina a Estrutura Central da Aplicação 🧱

A Clean Architecture divide a aplicação em camadas distintas (conhecida como _Onion Architecture_):

### 📦 Camadas da Onion Architecture:

- **Entities (Entidades)**: Modelos de domínio e lógica de negócio
- **Use Cases (Casos de Uso)**: Regras de negócio específicas da aplicação
- **Interface Adapters (Adaptadores de Interface)**: Adaptadores e controladores para interagir com sistemas externos
- **Frameworks and Drivers (Frameworks e Drivers)**: Componentes externos como bancos de dados e servidores web

No **NestJS**, essas camadas podem ser representadas usando módulos e serviços.

---

## 2. Configure seu Projeto

Comece criando um novo projeto NestJS (caso ainda não tenha feito isso):

```bash
nest new clean-architecture-app
```

---

## 3. Crie Entidades Centrais

Defina seus modelos de domínio na pasta `src/domain`:

```ts
// src/domain/user.entity.ts
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
  ) {}
}
```

---

## 4. Implemente Casos de Uso

Casos de uso definem a lógica de negócio da sua aplicação. Coloque-os em `src/use-cases`:

```ts
// src/use-cases/create-user.use-case.ts
import { User } from '../domain/user.entity';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string): Promise<User> {
    const user = new User(this.generateId(), name, email);
    await this.userRepository.save(user);
    return user;
  }

  private generateId(): string {
    return 'unique-id'; // Substitua com lógica real de geração de ID
  }
}
```

---

## 5. Crie Adaptadores de Interface

Eles fazem a ponte entre a camada HTTP e a lógica da aplicação. Coloque-os em `src/interfaces`:

```ts
// src/interfaces/user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';

@Controller('users')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    return this.createUserUseCase.execute(body.name, body.email);
  }
}
```

---

## 6. Conecte Frameworks e Drivers

Aqui você integra componentes externos como bancos de dados. Coloque esses arquivos em `src/infrastructure`:

```ts
// src/infrastructure/user.repository.ts
import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';

@Injectable()
export class UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  // Outros métodos do repositório
}
```

---

## 7. Configure os Módulos do NestJS

Integre tudo no seu `AppModule`:

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './interfaces/user.controller';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { UserRepository } from './infrastructure/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [CreateUserUseCase, UserRepository],
})
export class AppModule {}
```

---

## ✅ Conclusão

Implementar a **Clean Architecture** com NestJS oferece uma base robusta para construir aplicações **escaláveis** e **fáceis de manter**.

Ao seguir esses princípios:

- Seu código se torna **organizado** e **testável**
- A lógica de negócio permanece **independente** de tecnologias externas
- Você está preparado para **mudanças futuras**

Conforme sua aplicação cresce, a Clean Architecture será sua aliada, ajudando a manter a clareza e o controle no desenvolvimento de software.

```

```
