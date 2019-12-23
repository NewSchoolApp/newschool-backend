## Guia para uso de variáveis de configuração

Para acesso às variáveis de ambiente do projeto (.env), utilizamos o pacote do Nest `@nestjs/config`.
Este pacote consiste de 2 classes:

- `ConfigModule`
  - Módulo de configuração, que expõe o serviço (ConfigService) para utilização

- `ConfigService`
  - Serviço responsável pelo carregamento e disponibilização das variáveis de configuração para uso no código

O `ConfigModule` já é instanciado de forma global no "start" da aplicação, sendo necessário apenas instanciar o `ConfigService` nas classes que farão uso das variáveis.

### Utilização do ConfigService

Para utilizar o `ConfigService` em uma classe, será necessário:

- Importar a classe `ConfigService`
>**import { ConfigService } from '@nestjs/config';**

- Em um módulo, sempre que for necessário importar um módulo do Nest (ex.: `JwtModule`) com uso de variáveis de ambiente, deve-se usar o método `RegisterAsync`, inserindo o `ConfigService` por injeção de dependência. Exemplo:
``
JwtModule.registerAsync({
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN') },
  }),
  inject: [ConfigService],
}),
``

- Em outras classes (controllers, services...), deve-se declarar o `ConfigService` como parâmetro do construtor para utilização do mesmo como atributo da classe.
>**constructor(private readonly configService: ConfigService) {}**

- O acesso a variáveis de ambiente, onde seria utilizado o formato `process.env.<VARIAVEL>`, deve ser feito com a seguinte estrutura:
  - Em módulos:
  >**configService.get<string | number>('VARIAVEL')**

  - Em outras classes:
  >**this.configService.get<string | number>('VARIAVEL')**

Para maiores informações sobre o `@nestjs/config`, acesse: https://docs.nestjs.com/techniques/configuration



