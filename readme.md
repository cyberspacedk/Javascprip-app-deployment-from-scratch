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

Не забываем обновить  `Babel загрузчик`. Если будут файлы с расширением `.jsx` то нужно добавить их в тест регулярки. 

```js
rules: [
			{
				test: /\.js|\.jsx$/, 
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

11. Support CSS/SCSS

Для поддержки файлов стилей нужно достваить нужный лоадер

```js
npm i -D css-loader style-loader
```

После в базовом конфиге обновить массив правил - `rules`
```js
{
	test: /\.css$/,
	use: ['style-loader', 'css-loader'],
	exclude: /node-modules/
}
```

12. Hot loader

[github](https://github.com/gaearon/react-hot-loader)  
[читаем-раз](https://gaearon.github.io/react-hot-loader/getstarted/)
[читаем-два](https://habr.com/ru/post/433122/)  

Горячая перезагрузка позволяет перерендеривать компонент без перезагрузки страницы, тем самым избегая потери состояния компоненты.

Ставим пакет как `dependencies`. 

```js
npm i -S react-hot-loader
```
**После нужно**

- на уровне Арр импортировать `import {hot} from 'react-hot-loader/root'` ПЕРЕД импортом React  
- при экспорте компоненты обернуть в хок `export default hot(App)`  
- обновить плагины babel в base  конфиге 
```js
{
				test: /\.js|\.jsx$/, 
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react'],
					plugins: ['react-hot-loader/babel','@babel/plugin-proposal-class-properties']
				}
			},
```  
- создать новый скрипт в package.json с добавлением флага `--hot`
```js
"dev:hot": "npm run dev -- --hot"
```  

13. Bundle analyzer

[инфа и опции](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin)
```js
npm i -D webpack-bundle-analyzer
```
После установки обновляем `production` конфиг  
```js
const merge = require('webpack-merge');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
    mode: 'production',
    plugins: [ new BundleAnalyzerPlugin({
			analyzerMode: 'static'
		})]
})
```
Запустив режим продакшена, в браузере откроется окно в котором будет отображена полная информация о составе бандла.

Передав в качестве опции `analyzerMode: 'static'` получим в папку `dist` файл `report.html` c информацие о бандле.

14. Browser support. Babel polyfill

Поддержка новых свойств в браузерах.

```js
npm i -S @babel/polyfill
```
После установки, чтобы не загружать всю либу, нужно определить браузеры которые нужно поддерживать 
Посмотреть список `npx browserslist`
Нужно прописать список браузеров в настроках `babel-loader` в `base` конфиге 

```js
{
  test: /\.js|\.jsx$/, 
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    presets: [['@babel/preset-env', {
      targets:  [
        'last 2 versions',
        'not dead',
        'not < 2%',
        'not ie 11'
        ],
      useBuiltIns: 'entry'
    }], '@babel/preset-react'],

  plugins: ['react-hot-loader/babel','@babel/plugin-proposal-class-properties']
  }
},
```

15. React/ReactDom CDN

С целью оптимизации бандла можем вынести `react` и `react-dom` в режиме продакшена, включив их  минифицированные сборки с помощью CDN.

[ссылки на CDN](https://ru.reactjs.org/docs/cdn-links.html)

В `production` конфиге нужно добавить поле `externals` в которой указать внешние источники

```js
const merge = require('webpack-merge');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
    mode: 'production',
    plugins: [ new BundleAnalyzerPlugin({
        analyzerMode: 'static'
    })],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    }
})
```

В файле `src/index.html` нужно прилинковать ссылки на CDN

```html
 <div id="root"></div>
    <% if(process.env.NODE_ENV === 'production') {%>
        <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <%} %>
```

Webpack присборке проекта прилинкует `react` и `reactDom`.

16. Dynamic import support 

Для поддержки синтаксиса динамического импорта `React.lazy(()=> import('./component'))` нужно добавить `Babel` плагин. 

```js
npm i -D @babel/plugin-syntax-dynamic-import
```
После этого нужно обновить массив плагинов `babel` в `base` конфиге

```js
plugins: [
						'react-hot-loader/babel',
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-syntax-dynamic-import'
					]
```