<p align="center">
  <img src="https://xesque.rocketseat.dev/platform/1659122823166.svg" alt="React Native">
</p>

# Ignite Quiz
Projeto desenvolvido na trilha de react native do programa Ignite da Rocketseat.

## Protótipo
<img src="./assets/Screens.png" alt="Protótipo das telas">

## Configuração do ESLint e Prettier
- Instalação do package para expo:
```bash
  npm i eslint-config-universe --save-dev
```

- Instalação das ferramentas e tipagens:
```bash
  npm i eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev
```

- Atualização no <b>package.json</b>:
```json
  {
    ...
    "eslintConfig": {
      "extends": "universe/native"
    }
  }
```

- Criação do arquivo <b>.prettierrc</b> para configuração do prettier.
