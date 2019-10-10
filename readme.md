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
    "build": "webpack --mode=production",
    "dev": "webpack --mode=development"
}
``` 

Скрипт с флагом `-- --mode` запустит сборку в том режиме , который укажем после `mode`. 
Например `npm run build -- --mode development` 

3. Создаем в корне `.gitignore` 

```js 
// .gitignore

node_modules
dist
```

4. Ставим `Babel`.

```js
npm i -D @babel/core @babel/cli @babel/preset-env
```
Также установим сразу и `babel-loader` для `webpack` и пропишем лоадер для `.js` в `webpack.config.js`. правила.

```js
npm i -D babel-loader
```

5. Ставим `react` , `react-dom`, `prop-types`.

```js
npm i -S react react-dom prop-types 
```
Для того чтобы `Babel` смог обработать jsx код нужно добавить пресет для react.

```js
npm i -D @babel/preset-react
```

Не забываем обновить  `Babel загрузчик`

```js
rules: [
			{
				test: /\.js$/, 
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react']
				}
			}
		]
```

6. Для работы с `html` файлами необходимо уставновить плагин `html-webpack-plugin`

```js
npm i -D html-webpack-plugin
```
Также нужно создать в `src` html-темплейт `index.html` с одним тегом которому дать `id` который мы указали для рендера разметки реакт. 

В настройках плагина указать этот темплейт.

```js
plugins: [new HtmlWebpackPlugin({
	template: './index.html'
})]
```
Теперь реакт будет вставлять сгенерированный `DOM` в этот тег, и `webpack` в конец `body` подключит собранный бандл.

7. Webpack_merge

Для разделения режима сборки на **development** / **production** и присоединения только необходимых нстроек к базовому конфигу. 
```js
npm i -D webpack-merge
```
Разбиваем основной `webpack.config.js` на логические блоки. 
- `webpack.config.base.js` 
- `webpack.config.dev.js` 
- `webpack.config.prod.js` 

8. DEVSERVER

Для отслеживания изменений в реальном времени
```js
npm i -D webpack-dev-server
```
9. DEVTOOL

[read ...](https://webpack.js.org/configuration/devtool/#devtool)

Для читаемости кода который сбандлили нужно прописать поле `devtool: 'source-map'`. 
Для режима **dev** и **prod** можно указывать разные опции 

10. Support proposal features

В стандартный пресет `babel` не входят фичи из стадии `proposal`, например как синтаксис полей класса `state = { field: value }`

Чтобы `babel` смог обрабатыватть такой код нужно расширить пресеты

Ставим 
```js
npm i -D @babel/plugin-proposal-class-properties
```
И добавляем в настроки `babel-loader` новый плагин
```js
module: {
	rules: [
		{
			test: /\.js|\.jsx$/, 
			loader: 'babel-loader',
			exclude: /node_modules/,
			options: {
				presets: ['@babel/preset-env', '@babel/preset-react'],
				plugins: ['@babel/plugin-proposal-class-properties']
			}
		}
	]
	},
```