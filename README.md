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

  npm install --save-dev eslint-plugin-import
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

## Configuração de ambientes
- Instalação do <b>react-native-dotenv</b>:
```bash
  npm i react-native-dotenv --save-dev
```

- Configuração do <b>babel.config.js</b>:
```js
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        allowUndefined: false,
      },
    ],
  ],
```

- Criação do arquivo <b>.env</b> na raiz do projeto;

- Criação do arquivo <b>env.d.ts</b> na pasta de @types:
```ts
  declare module '@env' {
    export const ANDROID_CLIENT_ID: string;
    export const IOS_CLIENT_ID: string;
  }
```

## OAuth 2.0
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)

## Realm DB
- Instalação:
```bash
  npm install realm

  # On iOS
  cd ios && pod install && cd ..
```

- Hooks para facilitar o desenvolvimento com o Realm
```bash
  npm install @realm/react
```

## Icons
- [Phosphor Icons](https://phosphoricons.com/)
- [Expo Svg](https://docs.expo.dev/versions/latest/sdk/svg/)

## Imagem
- Para manter a foto do usuário em cache, foi utilizado o [Expo Image](https://docs.expo.dev/versions/unversioned/sdk/image/?utm_source=google&utm_medium=cpc&utm_content=performancemax&gclid=CjwKCAjwm4ukBhAuEiwA0zQxkzBxrbY24r7ODEAtHunFclBRJ0aeDcLai984m57ebLg7zkm5qkMzEhoC-awQAvD_BwE)