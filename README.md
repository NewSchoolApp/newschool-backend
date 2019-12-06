#@NewSchool/back
> Backend da NewSchool, desenvolvido em NodeJS
> Banco de Dados MySQL

# Como rodar o project

Você pode rodar o projeto direto da sua máquina. Mas dessa
maneira terá instalar todas as dependências por sua conta.  
Caso opte por essa opção, para rodar o backend basta rodar
os seguintes comandos:

1- Instalar o NestJs cli globalmente na sua máquina  
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

# Guidelines

# Como contribuir

# Código de conduta

# Bugs
