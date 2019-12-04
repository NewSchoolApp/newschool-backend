# @NewSchool/back
> Backend da NewSchool, desenvolvido em NodeJS

## Como rodar o projeto

Você pode rodar o projeto direto da sua máquina. Mas dessa
maneira terá instalar todas as dependências por sua conta.  
Caso opte por essa opção, para rodar o backend basta rodar
os seguintes comandos:

1- Instalar o NestJs cli globalmente na sua máquina  
>**npm i -g @nestjs/cli**

2- Rodar o comando para iniciar o ambiente de desenvolvimento local
>**npm run start:dev**

Ou, você pode optar por rodar o projeto via Docker. Para isso precisamos 
que você tenha instalado o Docker e o Docker Compose na sua máquina.
Após isso basta rodar o seguinte comando:

>**docker-compose up**

E o ambiente de desenvolvimento estará rodando localmente para você. Lembrando
que estamos com o hot reloading no Docker também, ou seja, você não precisará
ficar parando o container e subindo ele novamente a cada mudança que você fizer.
Isso acontecerá automaticamente.

## Como contribuir

### Guidelines

### Crie uma branch

1. `git checkout master` de qulauqer pasta no seu repositório local do `NewSchool/back`
1. `git pull origin master` para garantir que você tenha a última versão do código principal
1. `git checkout -b minha-branch` (trocando `minha-branch` com um nome que se encaixe) para criar sua branch

### Faça a alteração

1. Siga as instruções de "Como rodar o projeto"
1. Salve os arquivos e verifique seu terminal se não possuí nada quebrado

### Teste as alterações

1. Se possível, teste suas alterações.

### Faça o Push

1. `git add -A && git commit -m "Minha mensagem"` (Troque o `Minha mensagem` com a mensagem do seu commit, como por exemplo `Adicionado entidade Usuario`) para organizar e realizar o commit das alterações
1. `git push my-fork-name minha-branch`
1. Vá para o [NewSchool/back repo](https://github.com/NewSchoolBR/newschool-backend) e você já deve ver a suabranch recente.
1. Siga as instruções do GitHub's.

## Código de conduta

## Bugs
teste
