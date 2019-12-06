#@NewSchool/back

> Backend da NewSchool, desenvolvido em NodeJS
> Banco de Dados MySQL


# Como rodar o projeto

Você pode rodar o projeto direto da sua máquina. Mas dessa
maneira terá instalar todas as dependências por sua conta.  
Caso opte por essa opção, para rodar o backend basta rodar
os seguintes comandos:

1 - Instalar o NestJs cli globalmente na sua máquina  
>**npm i -g @nestjs/cli**


2- Rodar o comando para instalar as depedencias do projeto
>**npm install**

3- Configurar as variaveis de ambiente
>**DATABASE_HOST=127.0.0.1**
>**DATABASE_NAME=newschool**
>**DATABASE_USERNAME=root**
>**DATABASE_PASSWORD=123456**
>**NODE_ENV=test**
>**JWT_SECRET=secret**
>**EXPIRES_IN_ACCESS_TOKEN=12000**
>**EXPIRES_IN_REFRESH_TOKEN=24000**

4- Rodar o comando para iniciar o ambiente de desenvolvimento local
>**npm run start:dev**

Ou, você pode optar por rodar o projeto via Docker. Para isso precisamos 
que você tenha instalado o Docker e o Docker Compose na sua máquina.
Após isso basta rodar o seguinte comando:

>**docker-compose up**

E o ambiente de desenvolvimento estará rodando localmente para você. Lembrando
que estamos com o hot reloading no Docker também, ou seja, você não precisará
ficar parando o container e subindo ele novamente a cada mudança que você fizer.
Isso acontecerá automaticamente.

5- Para executar os teste E2E execute o script abaixo
>**npm run test:e2e**

# Guidelines

# Como contribuir

1 - CONHEÇA O PROJETO **New School**

https://youtu.be/u4O8wE0gYO0

2 - ENTRE NO SLACK

https://join.slack.com/t/newschoolgrupo/shared_invite/enQtODQ4NjUyMjAzNTUzLTg3NTJiNmQ1ODE3YzYzMjcyYzVhYTNkZjIzYjViMjI4NTBjYzFiYTc3Njg0ZWI3YTk2MjE5NDY3MDlkYzViOGI

2.1 - LÁ NO SLACK, ENTRE NO CANAL #BACKEND

- Se apresente. Nome, cidade, profissão, e principais habilidades.
- Pergunte sobre as tarefas em aberto.
- Troque uma ideia com o time técnico. Comente como planeja solucionar. Ouça os conselhos dos devs mais experientes. Esse alinhamento é super importante pra aumentar significativamente as chances do seu PULL REQUEST ser aprovado depois.

3 - FAÇA PARTE DA EQUIPE NO TRELLO

https://trello.com/invite/b/2MHuWn0C/b1a15b7112ea11b856cfa78174a6f72d/projeto-new-school-app

3.1 - PEGUE UMA TAREFA NO TRELLO.

- https://trello.com/b/2MHuWn0C/projeto-new-school-app
- Coloque no seu nome e mova para DOING.

4 - GITHUB

4.1 FAÇA UM FORK DO REPOSITÓRIO

https://github.com/NewSchoolBR/newschool-backend

4.2 ESCREVA CÓDIGO

Hora de colocar a mão na massa. A parte mais divertida, trabalhar no código-fonte. Depois de concluir e testar, envie e aguarde o PULL REQUEST ser aprovado.

5 MISSÃO CUMPRIDA. VC AJUDOU O PROJETO. ❤️

# Código de conduta

# Bugs
