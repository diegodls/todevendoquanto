# ToDeVendoQuanto

<p dir="auto" align="center">
  <a
    target="_blank"
    alt="Banner"
    title="Banner"
    href="https://github.com/diegodls/todevendoquanto/blob/master/back/docs/img/readme/banner_full.png"
  >
    <img alt="Banner" title="Banner" src="https://github.com/diegodls/todevendoquanto/blob/master/back/docs/img/readme/banner_full.png"/>
  Expandir
    </a>
</p>

Uma aplicação para controle financeiro de maneira fácil e eficiente.

## Acesso rápido

- [Por que](#por-que)
- [Sobre](#sobre)
- [Features](#features)
- [Instalação](#instalação)
- [Uso](#uso)
- [Tecnologias](#tecnologias)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Por que

Projeto em desenvolvido para aplicação de conhecimentos adquiridos em:

- Desenvolvimento Fullstack
- SOLID
- Arquitetura Limpa (Clean Architecture)
- Injeção de dependência (DI)
- Testes

## Sobre

ToDeVendoQuanto é uma aplicação feita em Node.js, Next.js com a missão de ajudar seus usuários a controlar suas finanças, verificar e eliminar gastos.

## Features

- Cadastro, atualização e exclusão de perfis.
- Cadastro, atualização e exclusão de gastos.
- Acesso ao resumo dos gastos e/ou de um gasto especifico.
- Interface familiar para controle de gastos.
- Sistema de tags para agrupamento e localização de gastos.

## Instalação

1. Clone o repositório:
    ```git clone https://github.com/diegodls/todevendoquanto.git```

## Uso

### Backend

1. Com uma janela de comando/prompt/cmd aberta, navegue até a raiz da api:
    ```cd todevendoquanto\back```

2. Instale as dependências:
    ```npm install```

3. Configure um banco de dados, seja [Postgresql](https://www.postgresql.org/), [Mongo](https://www.mongodb.com/) ou outro.

4. Crie um arquivo `.env` na raiz do projeto e configure seguindo o arquivo `.env-example` de exemplo.

5. Adicione a url do banco de dados no arquivo `.env` criado seguindo o exemplo `.env-example`:
   ```DATABASE_URL="your_database_connection_string"```

6. Gere o Cliente do Prisma com o comando:
    ```npx prisma generate```

7. Rode as migrations do prisma com:
    ```npx prisma migrate dev --name init```

8. Inicie a api com o comando:
    ```npm run dev```

9. Consuma a api pela url `http://localhost:3333` (ou outra porta configurada no `.env`), recomendo a leitura do arquivo de rotas ou documentação.

## Tecnologias

### Backend

- Node.js
- Typescript
- Express.js
- Prisma
- E demais dependências listadas no arquivo `package.json`.

## Contribuição

Correções ou dicas são bem vindas.

## Licença

Este projeto está sobre a [MIT License](Licença MIT).
