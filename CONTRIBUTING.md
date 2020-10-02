# Contribuição

🚀 Obrigado por contribuir com a NewSchool! 🚀

Se você participar, a gente vai entender que você concordou com o nosso [Código de conduta](CODE_OF_CONDUCT.md), ok?

Se você tiver alguma dúvida que não falamos aqui, você pode falar no nosso [Discord](https://discord.gg/rb5sDG)

## Glossário

- **ORM**: Biblioteca que abstrai o banco de dados com a aplicação.

## Filosofia

Somos um movimento de educação que está formando novos protagonistas da quebrada por meio de experiências transformadoras de aprendizagem lúdica e prática.

Trabalhamos duro para dar acesso à educação de qualidade na linguagem da quebrada para os jovens das periferias de todo o Brasil através da tecnologia e de um conceito diferenciado de educação.

## Tarefas

Para pegar as tarefas, veja no nosso [Trello](https://trello.com/b/hY1tozEd/ns-squad). Tarefas de backend serão aceitas nesse repositório, enquanto as de frontend devem ser mandadas para [esse repositório](https://github.com/NewSchoolApp/newschool-frontend)

## Arquitetura

As tecnologias que usamos são:

- [NodeJS](https://nodejs.org/) como linguagem
- [NestJS](https://nestjs.com/) como framework
- [TypeORM](https://typeorm.io/#/) como ORM pra banco de dados
- MySQL como banco de dados

## Variáveis de ambiente

Como projeto Open Source, tentamos fazer um ambiente fácil para que todo mundo possa contribuir com o mínimo de esforço possível.

Quando você fizer `clone` do projeto, você vai ver um arquivo chamado `.env.example`. Esse arquivo é um arquivo com variáveis de ambiente que podem ser usadas
por todo mundo que contribuir. Para rodar o projeto, crie um novo arquivo chamado `.env`, copie todo o conteúdo do `.env.example` e cole dentro do seu criado `.env`

## Linter e Formatador

Usamos o ESLint e Prettier para garantir que nosso código siga o mesmo padrão. Sempre que você der `git commit`, o projeto irá rodar o prettier com o eslint
e formatar todos os arquivos que estejam fora do nosso padrão. Porém, se você quiser rodar por conta, use o seguinte comando:

```shell script
npm run lint # Isso roda o linter pra dizer o que seu código tem de errado
npm run format # Isso roda o prettier pra formatar os arquivos
```

## Testes

No back-end, usamos testes de integração para garantir que está tudo funcionando. Nossos testes se conectam com uma base de dados, e a configuração está no arquivo
`jest-e2e.config.js`

Como conceito de todo teste, precisamos testar todos os fluxos que podemos ter, então, tente mapear os fluxos possíveis na usa tarefa e faça testes para cobrir eles.

Na pasta `test`, temos alguns testes já feitos, de uma olhada em como eles funcionam e se tiver alguma dúvida, não deixe de mandar no nosso [Discord](https://discord.gg/rb5sDG)

## Git/GitHub workflow

Esse é o processo que fazemos aqui na NewSchool

1. Fork esse repositório
2. Você provavelmente vai iniciar na branch `master`, troque pra branch `develop` e rode `npm install`
3. Crie uma branch a partir da `develop` com esse comando: `git checkout -b feature/<nome-da-minha-feature>`
4. Faça sua tarefa baseado na sua task do Trello e não esqueça de ir dando `git commit` durante isso
5. Quando sua tarefa estiver pronta, se você ainda não deu `git push`, use o comando `git push origin feature/<nome-da-minha-feature>` para subir seu código para o seu fork
6. Crie um pull request da sua branch para a branch `develop`
7. Não precisa marcar ninguém na Pull Request. Não se preocupe, veremos seu Pull Request quando der :smile:
8. Quando revisarmos e se estiver tudo certo, nós iremos mergear para você
