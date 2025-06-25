# Diagaramas

Acesse o site:
https://www.plantuml.com/plantuml/uml

Insira o código abaixo na tela do plantuml e clique depois em submit:

## Diagrama de caso de usos:

@startuml
left to right direction
skinparam packageStyle rectangle

actor "Usuário Externo" as ExternalUser

rectangle "Sistema NestJS" {

usecase "Criar Usuário" as UC1
usecase "Atualizar Usuário" as UC2
usecase "Consultar Usuário" as UC3
usecase "Deletar Usuário" as UC4

ExternalUser --> UC1
ExternalUser --> UC2
ExternalUser --> UC3
ExternalUser --> UC4
}

note right of UC1
Rota: POST /user
DTO: create-user.dto.ts
Controller: user.controller.ts
Serviço: user.service.ts
end note

note right of UC2
Rota: PUT /user/:id
DTO: update-user.dto.ts
Controller: user.controller.ts
Serviço: user.service.ts
end note

note right of UC3
Rota: GET /user/:id ou /user
Controller: user.controller.ts
Serviço: user.service.ts
end note

note right of UC4
Rota: DELETE /user/:id
Controller: user.controller.ts
Serviço: user.service.ts
end note
@enduml

# Diagrama de Atividade:

@startuml
start

:Usuário acessa página create.html;
:Preenche formulário com nome e email;
:Submete dados via fetch POST /user;

partition Frontend {
:script.js envia JSON;
}

partition Backend {
:NestJS recebe requisição no UserController;
:Cria instância de CreateUserDto;
:Chama método userService.create();

partition UserService {
:Extrai name e email do DTO;
:Abre conexão com DatabaseService;
:Executa INSERT INTO users;
if (erro na inserção?) then (sim)
:Retorna erro ao controller;
else (não)
:Retorna objeto com id, name e email;
endif
}

:Controller retorna resposta para o frontend;
}

:Frontend exibe confirmação ou erro;

stop
@enduml

# Diagrama de Sequência:

@startuml
actor Usuário
participant "create.html\n(script.js)" as Frontend
participant "UserController" as Controller
participant "UserService" as Service
participant "DatabaseService" as DB

Usuário -> Frontend : Preenche nome e email
Frontend -> Controller : POST /user\n{ name, email }
Controller -> Service : create(createUserDto)
Service -> DB : db.run(INSERT INTO users)

alt Sucesso
DB --> Service : { id, name, email }
Service --> Controller : Retorna usuário criado
Controller --> Frontend : HTTP 201 Created\n{ id, name, email }
Frontend -> Usuário : Exibe sucesso
else Erro
DB --> Service : Erro de inserção
Service --> Controller : lança erro
Controller --> Frontend : HTTP 500 Internal Error
Frontend -> Usuário : Exibe mensagem de erro
end
@enduml

# Diagrama de Classe:

@startuml
skinparam packageStyle rectangle
skinparam classAttributeIconSize 0

package "src/user/dto" {
class CreateUserDto { - name: string - email: string
}

class UpdateUserDto { - name: string - email: string
}
}

package "src/user/entities" {
class UserEntity { - id: number - name: string - email: string
}
}

package "src/database" {
class DatabaseService { - db: Database + connection(): Database + onModuleInit(): void
}
}

package "src/user" {
class UserService { - db: Database + create(dto: CreateUserDto): Promise + findAll(): Promise + findOne(id: number): Promise + update(id: number, dto: UpdateUserDto): Promise + remove(id: number): Promise
}

class UserController { + create(dto: CreateUserDto) + findAll() + findOne(id: number) + update(id: number, dto: UpdateUserDto) + remove(id: number)
}

class UserModule
}

package "src" {
class AppModule
class main
}

' Relações
UserController --> UserService
UserService --> CreateUserDto
UserService --> UpdateUserDto
UserService --> DatabaseService
UserService --> UserEntity
UserController --> CreateUserDto
UserController --> UpdateUserDto
AppModule --> UserModule
AppModule --> DatabaseService
@enduml
