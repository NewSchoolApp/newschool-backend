#GUIDELINES


## Estrutura do projeto
O projeto é dividido em módulos, cada módulo sendo responsável por uma parte
específica do projeto. Para ser um módulo, ele precisa:

- Ser responsável por diversas features que são parecidas entre si
- Pode trabalhar de forma isolada ou tem pouca integração entre outros módulos
- Ele poderia se tornar em um serviço separado

Dentro de cada módulo, existe pastas para cada responsabilidade:
- Controller
    - Expõe endpoints. Além disso, são documentados via Swagger
- Service
    - Possuem a lógica de negócio. São eles que se ligam aos
    repositories para acesso ao banco
- Repository
    - Classes de acesso ao banco de dados
- Entity
    - Classes que mapeam o banco de dados
- DTO
    - Classes de transferência de dados entre o back e o front
- Mapper
    - Classe para transformar de Entity em DTO, e DTO em Entity
- Swagger
    - Classes para documentação

Cada pasta possue um `index.ts` para exportar os arquivos

> Porque essa estrutura?

Projetos em TypeScript tendem a seguir assim, o próprio NestJS
usa essa estrutura para seu código fonte.
