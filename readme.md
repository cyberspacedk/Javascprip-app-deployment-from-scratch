# How to deploy a project from scratch using modern JS tools.


1. Ставим `Node` и инициализируем проект вызвав 

```js
// с флагом -y если нужно просто заинитить проект
npm init -y 
// либо без флага -y если нужно заполнить поля с информацией о проекте 
```


# Webpack
```js
npm i --save-dev webpack webpack-cli
```

После установки `webpack` нужно прописать `npm-script` 

```js
// package.json

"scripts":{
    "start": "webpack --mode=development"
}
``` 