# How to deploy a project from scratch using modern JS tools.


1. Ставим `Node` и инициализируем проект вызвав 

```js
// с флагом -y если нужно просто заинитить проект
npm init -y 
// либо без флага -y если нужно заполнить поля с информацией о проекте 
```


2. Ставим Webpack. 

```js
npm i --save-dev webpack webpack-cli
```
Детальный туториал я описал тут [Webpack](https://github.com/cyberspacedk/JS_POCKET/tree/master/Webpack)

После установки `webpack` нужно прописать `npm-script` 

```js
// package.json

"scripts":{
    "dev": "webpack --mode=development"
}
``` 

3. Создаем в корне `.gitignore` 

```js 
node_modules
dist
```