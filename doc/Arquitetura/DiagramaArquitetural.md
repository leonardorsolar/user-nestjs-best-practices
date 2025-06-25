# Diagaramas

Acesse o site:
https://www.plantuml.com/plantuml/uml

Insira o código abaixo na tela do plantuml e clique depois em submit:

# Diagrama de Arquitetural:

@startuml
skinparam rectangle {
BackgroundColor<<frontend>> LightBlue
BackgroundColor<<backend>> LightGreen
BackgroundColor<<database>> LightYellow
}

actor "Usuário" as User

rectangle "Frontend (public)" <<frontend>> {
component "create.html"
component "script.js"
}

rectangle "Backend (NestJS)" <<backend>> {
component "main.ts"
component "app.module.ts"

package "User Module" {
component "user.controller.ts"
component "user.service.ts"
component "create-user.dto.ts"
component "user.entity.ts"
}

package "Database Module" {
component "database.service.ts"
}
}

database "SQLite" <<database>>

User --> "create.html" : acessa
"script.js" --> "user.controller.ts" : POST /user
"user.controller.ts" --> "user.service.ts" : create(dto)
"user.service.ts" --> "database.service.ts" : db.run(INSERT)
"database.service.ts" --> SQLite : query INSERT
SQLite --> "database.service.ts" : resposta
"database.service.ts" --> "user.service.ts"
"user.service.ts" --> "user.controller.ts"
"user.controller.ts" --> "script.js" : HTTP 201
@enduml

# Diagrama das Camadas:

@startuml
skinparam componentStyle rectangle

package "Interface de Entrada\n(Presentation)" {
[UserController]
}

package "Camada de Aplicação\n(Application)" {
[UserService]
}

package "Camada de Domínio\n(Domain)" {
[CreateUserDto]
[UpdateUserDto]
[UserEntity]
}

package "Infraestrutura\n(Infrastructure)" {
[DatabaseService]
[SQLite]
}

UserController --> UserService
UserService --> CreateUserDto
UserService --> UpdateUserDto
UserService --> UserEntity
UserService --> DatabaseService
DatabaseService --> SQLite

@enduml
