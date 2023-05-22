# AngularUniversalStarter


## Current enviroment
```
>> node --version
v16.13.1
>> npm --version
8.1.2
```

## Angular version
```
https://www.npmjs.com/package/@angular/cli/v/15.0.3
npm install -g @angular/cli@15.0.3

Using https://ng.ant.design/docs/introduce/en for styling, so not yet supported Angular 16
```

## For new-to-nodejs self-leaner
- `npm` is stand for node package manager
- `node` is stand for nodejs, use can use fixed version or using node version manager `nvm`
- 

## Replace those things
- find `angular-universal-starter` and replace with `your-app-name`
- find `AngularUniversalStarter` and replace with `YourAppName`


## Run CLI
- First thing first >> Install dependencies
```
npm i
```

- Run dev >> Serve App as SPA: 
```
nx run angular-universal-starter:serve:development
```

- Test server: serve as SPA if NOT Bot, serve as SSR if Bot
```
npm run build
npm run start
```

## Included

- [x] Morgan as Logger
- [x] PurgeCSS as unused CSS remover
- [x] Compression
- [x] Angular Universal basic walk-through
- [x] Support `nixpacks` deploy for `railway.app`
