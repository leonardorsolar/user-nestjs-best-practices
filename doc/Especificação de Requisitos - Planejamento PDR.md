## 📄 Especificação de Requisitos – Projeto de Cadastro de Usuários

### 1. **Objetivo do Sistema**

Desenvolver uma API RESTful com NestJS para gerenciar usuários, permitindo operações de **criação, consulta, atualização e remoção**, utilizando banco de dados SQLite. O frontend será simples com HTML/JavaScript.

---

### 2. **Escopo**

O sistema terá:

- Um backend (API) em NestJS com endpoints para CRUD de usuários.
- Um frontend HTML para interagir com a API.
- Banco de dados local SQLite com tabela `users`.

---

### 3. **Requisitos Funcionais (RF)**

| Código | Descrição                                                               |
| ------ | ----------------------------------------------------------------------- |
| RF01   | O sistema deve permitir cadastrar um novo usuário com nome e e-mail.    |
| RF02   | O sistema deve listar todos os usuários cadastrados.                    |
| RF03   | O sistema deve retornar os dados de um usuário específico, dado seu ID. |
| RF04   | O sistema deve permitir a atualização do nome e e-mail de um usuário.   |
| RF05   | O sistema deve permitir a exclusão de um usuário.                       |

---

### 4. **Requisitos Não Funcionais (RNF)**

| Código | Descrição                                                                |
| ------ | ------------------------------------------------------------------------ |
| RNF01  | A aplicação deve ser construída usando NestJS e TypeScript.              |
| RNF02  | O banco de dados utilizado será SQLite.                                  |
| RNF03  | O sistema deve seguir o padrão REST.                                     |
| RNF04  | As respostas da API devem estar no formato JSON.                         |
| RNF05  | O tempo de resposta para cada requisição deve ser inferior a 2 segundos. |

---

### 5. **Tecnologias Utilizadas**

- **Backend**: NestJS, TypeScript
- **Banco de Dados**: SQLite
- **Frontend**: HTML5, JavaScript (sem framework)
- **Padrão Arquitetural**: Modular (NestJS) com camada de serviço e DTOs

---

### 6. **Modelo de Dados (Tabela `users`)**

| Campo | Tipo    | Obrigatório | Observações     |
| ----- | ------- | ----------- | --------------- |
| id    | INTEGER | Sim         | Autoincremento  |
| name  | TEXT    | Sim         | Nome do usuário |
| email | TEXT    | Sim         | E-mail único    |

---

### 7. **Endpoints da API**

| Método | Rota       | Descrição                     | Corpo             |
| ------ | ---------- | ----------------------------- | ----------------- |
| POST   | /user      | Cadastrar usuário             | `{ name, email }` |
| GET    | /user      | Listar todos usuários         | —                 |
| GET    | /user/\:id | Buscar usuário por ID         | —                 |
| PUT    | /user/\:id | Atualizar dados de um usuário | `{ name, email }` |
| DELETE | /user/\:id | Remover um usuário            | —                 |

---

### 8. **Critérios de Aceitação**

- ✅ O cadastro não deve aceitar campos em branco.
- ✅ O email deve ter um formato válido.
- ✅ O backend deve retornar códigos HTTP adequados:

  - 201 para criação com sucesso
  - 200 para consultas e atualizações
  - 404 se usuário não for encontrado
  - 500 para erro interno

- ✅ A persistência dos dados deve ser garantida em disco via SQLite.
- ✅ O sistema deve permitir testes automatizados no backend (ex: `user.service.spec.ts`).

---

### 9. **Casos Futuros (Requisitos Desejáveis)**

- Autenticação e login de usuários.
- Filtro e paginação na listagem.
- Validação de e-mail duplicado.
