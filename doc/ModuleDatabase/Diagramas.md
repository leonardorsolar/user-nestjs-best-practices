# Diagaramas

Acesse o site:
https://www.plantuml.com/plantuml/uml

Insira o código abaixo na tela do plantuml e clique depois em submit:

# Diagrama Entidade-Relacionamento:

@startuml
!define table(x) class x << (T,#FFAAAA) >>

entity "users" as users {

- ## id : INTEGER <<PK>>
  name : TEXT
  email : TEXT <<UNIQUE>>
  }
  @enduml

---

<<PK>>: indica chave primária

<<UNIQUE>>: indica que o campo deve ter valores únicos

A linha -- separa a chave primária dos demais atributos (visualmente)
