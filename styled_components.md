![pic](http://i.piccy.info/i9/ec5c91dae17c0a0970b9e708b5255c8e/1556390885/40738/1314369/1_6E_EG6HczqSSsEQFgFlG_A.jpg)

-  [Intro](#Intro)  
-  [Under the hood](#Under_the_hood)
-  [Installation](#Installation)  
-  [Простая стилизация](#Simple_style)  
-  [Используем переменные](#Using_variables)  
-  [Props](#Props)  
-  [Ховер](#Ховер)  
-  [Наследование стилей](#Inheritans)  
-  [Стили для вложенных елементов](#Style_for_inside_element)  
-  [Pseudoelements, pseudoselectors, and nesting](#Pseudoelements_pseudoselectors_nesting)  
-  [Attributes](#attributes)   
-  [Медиа правила](#Media_Queries)  
-  [Хелперы](#Helper)  
-  [Миксины](#Mixins)  
-  [Глобальные стили](#Global_Styles)  
-  [Animations](#Animations)  
-  [HOC Styled](#HOC_Styled)  
-  [Issues with specificity](#specificity)  
-  [Server Side Rendering](#SSR)  
-  [nextjs setup](#nextjs_setup)  


### Intro

Styled components решают такие задачи как:

- Автоматический критический CSS  
`styled-components` **отслеживает**, какие компоненты **отображаются** на странице, и **вводит** их стили в комбинации с `code splitting`
> ! Лишние стили не загружаются, только необхожимые для отображения

- Модульность / Нет кофликтов имен классов  
`styled-components` генерирует **уникальные имена** классов для ваших стилей.  

- Нет мертвого кода / Очистка CSS  
При удалении компонента удаляется также связынные с ним стили

- Динамическая стилизация  
Стили компонента можем динамически менять в зависимости от переданных `props` или `theme`

- Конкретные стили для конкретной компоненты  
Нет необходимости искать по кодовой базу где лежат стили для компоненты

- Автоматическое проставление вендорных префиксов  и минификация css
Пишем css в по последним стандартам, прейиксы расставит `styled components`

- Нет необходимости создавать дополнительные файлы стилей

Использует css-препроцессор  [stylis](https://github.com/thysultan/stylis.js)

### Under_the_hood

Когда впервые импортируется библиотека в приложение, она создает внутреннюю переменную-счетчик для подсчета всех компонентов, созданных с помощью `styled`  

Когда `styled-components` создает новый компонент
- инкрементируется счетчик  
- создается внутренний идентификатор `componentId`, который составляется из разных значений  

```js
counter++;
const componentId = 'sc-' + hash('sc' + counter); // на выходе получим sc-bdVaJa
```

Как только идентификатор создан, `styled-components` вставляет  
- новый HTML элемент `<style> ` в `<head>`  
- добавляет специальный маркер комментария с **componentId** к элементу, который будет использоваться позже.  

```html
<style data-styled-components>
  /* sc-component-id: sc-bdVaJa */
</style>
```

Когда новый компонент создан  
- **componentId**   
- и целевой компонент, который мы передали в `styled`   
сохраняются в статических полях  

```js
StyledComponent.componentId = componentId;
StyledComponent.target = TargetComponent;
```

> Компоненты, созданные с помощью `styled` наследуются от класса `BaseStyledComponent`, который реализует несколько методов жизненного цикла.

#### При маунте компоненты **componentWillMount** 
`styled-component` запускает в свою очередь свой жизненный цикл 

1. Evaluating tagged template  
Оценка написанного в шаблонной строке (парсинг написанного css)  

2. Generating CSS class name  
Генерация уникального css className для компонеты, который состоит из хеша **componentId** и **оцененной шаблонной строки**  

В примере ниже, на выхое получим className вида **jsZVzX**  
```js
const className = hash(componentId + evaluatedStyles); 
```
> Затем это имя класса сохраняется в состоянии компонента как **generatedClassName** 

```js
this.state.generatedClassName
```

3. CSS Preprocessing  
Здесь на помощь приходит сверхскоростной CSS-препроцессор stylis, который помогает получить правильную строку CSS

```js
// получим .jsZVzX
const selector = '.' + className;  

// ф-ция которая соединит написанное в шаблонной строке с классом
const cssStr = stylis(selector, evaluatedStyles); 
```

В результате получим валидный css

```css
.jsZVzX {
  font-size: 24px;
  color: coral;
  padding: 0.25rem 1rem;
  border: solid 2px coral;
  border-radius: 3px;
  margin: 0.5rem;
}
.jsZVzX:hover{
  background-color: bisque;
}
```

4. Injecting CSS string into the page  
Теперь CSS должен быть вставлен в элемент <style> в <head> страницы сразу после маркера комментария компонента:

```html
<style data-styled-components>
  /* sc-component-id: sc-bdVaJa */
  .sc-bdVaJa {} 

  /* сгенерированные css селекторы с правилами */
  .jsZVzX{ 
    font-size:24px;
    color:coral; 
  }  

  .jsZVzX:hover{
    background-color:bisque;
  }
</style>
```

#### При рендере компоненты. Вызов метода **render()**

После того, как все закончилось с CSS, `styleled-components` просто нужно создать элемент с соответствующим className:

```js
//  Получаем те поля которые были созданы ранее
const TargetComponent = this.constructor.target; 
const componentId = this.constructor.componentId;
const generatedClassName = this.state.generatedClassName;

// формируем className из 
return ( 
  <TargetComponent 
    {...this.props} 
    className={this.props.className + ' ' + componentId + ' ' + generatedClassName}
  />
);
```
`styled-components` составляет className основываясь на    
- props.className - необязательно, передается родительским компонентом.   
- componentId - уникальный идентификатор компонента   
- generateClassName - uniq для каждого экземпляра компонента, который имеет действующие правила CSS

Выглядит так 

```js
<button class="sc-bdVaJa jsZVzX">I'm a button</button>
```

### При изменении `props` компоненты . **componentWillReceiveProps**.

При изменении props компонент перерендеривается, если наши css-стили зависят от props то будет сгенерирован весь цикл  событий как при **componentWillMount**  

1. Evaluate the tagged template.  
2. Generate the new CSS class name.  
3. Preprocess the styles with stylis.   
4. Inject the preprocessed CSS into the page.    

Если посмотреть в devTool на сгенерированный DOM то увидим, что для компоненты с id `sc-bdVaJa` генерируются каждый раз новый css-селектор. Изменяется `font-size`

```html
<style data-styled-components>
  /* sc-component-id: sc-bdVaJa */
  .sc-bdVaJa {} 
  .jsZVzX{font-size:24px;color:coral; } .jsZVzX:hover{background-color:bisque;}
  .kkRXUB{font-size:25px;color:coral; } .kkRXUB:hover{background-color:bisque;}
  .jvOYbh{font-size:26px;color:coral; } .jvOYbh:hover{background-color:bisque;}
  .ljDvEV{font-size:27px;color:coral; } .ljDvEV:hover{background-color:bisque;}
</style>
```

_________________________

### Installation

```js
npm i styled-component
```  
Затем импортируем там где пишем стили

```jsx
import styled from "styled-components";
```

либо линкуем в `<head>`

```html
<script src="https://unpkg.com/styled-components/dist/styled-components.min.js"></script>
```
после этого в глобальный объект `window` добавится новое поле `styled` которое будем использовать для стилизации компоненты.

Использование такого подключения требует подключения `React CDN` [link](https://reactjs.org/docs/cdn-links.html) до подключения `styled-components`

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>

<script src="https://unpkg.com/styled-components/dist/styled-components.min.js"></script>
```

> Рекомендуется использовать плагин [babel plugin](https://styled-components.com/docs/tooling#babel-plugin). Он предлагает множество преимуществ, таких как более разборчивые имена классов, совместимость рендеринга на стороне сервера, небольшие пакеты и многое другое.

### Simple_style

Создаем компонент , записываем в поле styled тот html тег который появится в разметке
В `temlate literal` пишем привычный css

```jsx
const Button = styled.button`
  padding: 25px;
  background-color: palevioletred;
  border: none;
  margin: 20px;
`;
```

### Using_variables

Использование переменных аналогично вставке JS выражений в TL.  `${...}` 

```jsx
let size = 12;
let colorRegular = "#ccc";

const Button = styled.button`
  padding: 25px;
  margin-bottom: ${size}px;
  background-color: palevioletred;
  border: none;
  margin: 20px;
  color: ${colorRegular};
`;
```

### Props

В CSS свойство, которое будет зависеть от переданного `props` передаем функцию, которая в агрументах получит ссылку на объект `props` компоненты и в зависимости от значений `props` возвращаем из ф-ции необходимый `css`

```jsx
const Button = styled.button` 
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"}; 
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

```
### Ховер

Правила аналогичные SCSS. 
 
пример для срабатывания hover на родителе
```jsx
const Title = styled.h2`
  background-color: aquamarine;
  width: 200px;
  &:hover {
    font-size: 70px;
    transition: 0.5s;
  }
`;
```
пример для срабатывания hover на дочернем элементе
```jsx 

const Controls = styled.div`
  //на компоненте Buttom
  &:hover ${Button} {
    background-color: #ccc;
  }

  // на елементе h2
  &:hover h2 {
    width: 400px;
  }
`;
```

### Inheritans

Если необходимо наследовать стили от другой компоненты, то следует передать этот компонент в метод `styled(...)`, а в TL указываем переопределяющие CSS правила

```jsx
// Наследуемся от компоненты Button и переопределям только цвет шрифта
const Cancel = styled(Button)`
  color: "#fff";
`;
```

### Style_for_children

Чтобы не создавать новый `styled` компонент, можно в родительском css styled блоке писать правила для вложенных елементов, по селектору (класса, тега и т.п)

```jsx
// Родительский блок
const Appheader = styled.header`
  padding: 10px;
  text-align: center;
  // правила для дочернего елемента с классом .color
  .color {
    background-color: yellow;
    border: 2px solid #000;
    font-weight: 800;
  }
`;
 
<Appheader>
  <span className="color">App header</span>
</Appheader>;
```

### Pseudoelements_pseudoselectors_nesting

Использование символа **&**

Благодаря препроцессору `stylis` есть возмжность использовать символ **&**, который в зависимости от места использования может играть роль:

- как отсылку к родителю 

```js
const Thing = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
  color: blue;

// <Thing> when hovered
  &:hover {
    color: red; 
  }

// <Thing> as a sibling of <Thing>, but maybe not directly next to it
  & ~ & {
    background: tomato; 
  }

// <Thing> next to <Thing>
  & + & {
    background: lime; 
    }

// <Thing> tagged with an additional CSS class ".something"
  &.something {
    background: orange; 
  }

// <Thing> inside another element labeled ".something-else"
  .something-else & {
    border: 1px solid; 
  }
` 
```

- как способ увеличить специфичность селектора. 
В примере ниже указав несколько **&&** увеличена специфичность на 1 селектор. 

Подробней [тут](#Specificity)

```js
const Thing = styled.div`
  && {
    color: blue;
  }
`

const GlobalStyle = createGlobalStyle`
  div${Thing} {
    color: red;
  }
`
```

### Attributes 

Для управления атрибутами элемента, сущуствует метод `attrs` который принимает аргументом ф-цию, в которой доступна ссылка на объект `props` в зависимости от значения которого можем управлять атрибутами для компоненты

- Пример с сеттингом атрибута и его значения в зависимости от `props` и дальнейшей стилизацией 

```js
const Input = styled.input.attrs(props => ({ 
  type: props.password ? "password" : "text,  
}))`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px; 
  margin: ${props => props.size};
  padding: ${props => props.size};
`; 
```

### Media_Queries

Стандартное использование директивы `@media`

```jsx 
const Controls = styled.div`
  button {
    background-color: palevioletred;
    &:hover {
      background-color: green;
    }
  }
// Начиная с минимальной ширины сработают правила
  @media (min-width: 768px) {
    background-color: purple;
// также можно выбирать отдельно для компоненты
    ${Button} {
      color: green;
    }
  }
`;

```

### Helper

Можно объявить переменную миксин/хелпер и использовать ее в стилях компоненты.

- если хелпер это просто набор css правил то пишем без вызова метода css
- если в хелпере будут вызываться функции или динамически подставляться пропсы, тогда нужно заимпортить css модуль из styled-component

```jsx
import styled, { css } from "styled-components";
```

Cоздадим хелпер который центрирует блок. Также сделаем возможным изменять положение блока например по вертикали, передав туда данные, которые получим из пропсов

```jsx
// CSS HELPERS
const centered = css`
  position: absolute;
  top: ${({ top }) => top + "%"};
  left: 50%;
  transform: translate(-50%, -50%);
`;
```
Используем этот хелпер например в медиа правилах.

```jsx 
const Button = styled.button`
  padding: 25px;
  background-color: palevioletred;
  border: none;
  margin: 20px;
  color: ${fontColor};
  // при минимальной ширине 900 пикселей к кнопке применится наш хелпер
  @media (min-width: 900px) {
    ${centered};
  }
`;
```

### Mixins

Миксины , которые принимают параметры создаются путем объявления функционального компонета, а простые миксины как переменные

Простой миксин

```jsx
const font = `
    font-family: Monospace;
    font-size: 20px;
    color: red
`;
```

Миксин с параметрами. Неплохо задать параметры поумолчанию и указать = {} чтобы небыло ошибки, если при вызове миксина не передадим агументов

```jsx
const position = ({posX =0; posY=0}={})=> css`
    position:absolute;
    top: ${posY};
    left: ${posX};
`;

const boxSize = ({ w = "100px", h = "100px" } = {}) => css`
  width: ${w};
  height: ${h};
  background-color: pink;
`;
```

Обычно создается отдельный файл для миксинов, откуда они экспортируются. После в месте где они нужны производим импорт нужного миксина и используем

- как переменную `${mixinName}` если это обычный миксин
- как вызов функции `${mixinName({arg1:val, arg2:val})}` если нужно передать аргументы

```jsx
export default styled(Footer)`
  padding: 10px;
  background-color: aquamarine;
  // Миксин как переменная
  p {
    text-align: center;
    ${font};
  }
  // Мииксн с аргументами. Переназначили дефолтный размер width
  div {
    ${boxSize({ w: "300px" })}
  }
`;
```

### Global_Styles

Для установки глобальных стилей, типа нормализации, шрифтов и т.п необходимо

- импортировать `createGlobalStyle` из `styled-components`

```jsx
import { createGlobalStyle } from "styled-components";
```

- в корне scr создать файл например `Globalstyles`

- в файле создать переменную, куда прописать все глобальные стили в `createGlobalStyle`

```jsx
const GlobalStyle = createGlobalStyle`
*{
    box-sizing:border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: Monospace,  sans-serif; 
  background-color: #ccc;
}`;
```

- произвести экспорт переменной

```jsx
export default GlobalStyle;
```

- заимпортить переменную в `entry point` приложения и поместить ее в конец компоненты

```jsx
import React from "react";
import Header from "./Header";
// global styles
import GlobalStyle from "./GlobalStyles";

function App() {
  return (
    <div className="App">
      <Header />
      <GlobalStyle />
    </div>
  );
}

export default App;
```

### Animations
 
CSS-анимации с `@keyframes` не ограничиваются одним компонентом, чтобы они были глобальными и избежать конфликтов имен, нужно использовать  импортированный `keyframes`, который сгенерирует уникальный экземпляр

```js
// Создаем анимацию
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  } 
`;

// используем созданную анимацию
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
    font-size: 1.2rem;
`;

render(
  <Rotate>&lt; 💅 &gt;</Rotate>
);
```
> Ключевые кадры не поддерживаются в `react-native` Вместо этого используйте `ReactNative.Animated API`


### HOC_Styled

Использование styled hoc - оборачиваем созданный компонент , стилизуем его и експортируем дальше

Создадим компонент. Нужно не забыть заглушить поле className чтобы гарантированно поставились НАШИ стили.

```jsx
import React from "react";
import styled from "styled-components";

const Footer = ({ className }) => {
  return (
    <footer className={className}>
      <p>This is footer app</p>
    </footer>
  );
};
```

Обернем его в styled HOC и зададим стили для всего блока и для вложенных также

```jsx
export default styled(Footer)`
  padding: 10px;
  background-color: aquamarine;
  p {
    text-align: center;
  }
`;
```
### Specificity

В случае когда css передается и как styled и как css селектор, который потом указывается в свойстве `className` больше специфичность будет у `styled` 

По умолчанию styled-компоненты внедряют свои стили во время выполнения кода в конце <head>. 
Таким образом, его стили побеждают другие селекторы одного класса.

```js
// стилизуем div
const MyComponent = styled.div`background-color: green;`;

// my-component.css
.red-bg {
  background-color: red;
}
 
//  назначаем класс который передастся компоненту
<MyComponent className="red-bg" />
```

Если нужно чтобы стили в className перебили styled, то нужно добавить вес селектору (+класс/тег/id)

В случае, когда специфичность например глобальных стилей `styles.css` перебивает специфичность `styled component` можно воспользоваться плагином 

> [babel-plugin-styled-components-css-namespace](https://github.com/QuickBase/babel-plugin-styled-components-css-namespace)

который позволяет увеличить специфичность разными способами

Также существует способ добавить специфичности и в самой библиотеке `styled components`

Обернутой компоненте передаем '&&&'
```js
const MyStyledComponent = styled(AlreadyStyledComponent)`
  &&& {
    color: palevioletred;
    font-weight: bold;
  }
`
```
Каждый символ '&' будет добавлять css класс. 
В примере ниже каждый символ '&' => 'MyStyledComponent-asdf123'

```js
.MyStyledComponent-asdf123.MyStyledComponent-asdf123.MyStyledComponent-asdf123 {
  color: palevioletred;
  font-weight: bold;
}
```

### Как переопределить инлайновые стили ?? 

Добавляем ` &[style]` и `!important`

```js 
const MyStyledComponent = styled(InlineStyledComponent)`
  &[style] {
    font-size: 12px !important;
    color: blue !important;
  }
`
``` 

### SSR

`styled-components` поддерживает параллельный рендеринг на стороне сервера с регидратацией таблиц стилей.

Основная идея заключается в том, что каждый раз, когда вы визуализируете свое приложение на сервере, вы можете создать `ServerStyleSheet` и добавить **провайдера** в ваше дерево React, которое принимает стили через контекстный API.

Для корректного отображения стилей после компиляции на сервере нужно произвести неболшой сетап.

[babel плагин](https://styled-components.com/docs/tooling#babel-plugin)
Этот плагин добавляет поддержку рендеринга на стороне сервера, минимизацию стилей
После этого нужно подредактировать настройки `.babelrc` добавив плагин

```json
{
  "plugins": ["babel-plugin-styled-components"]
}
```

**Добавляя уникальный идентификатор** к каждому стилизованному компоненту, этот плагин позволяет избежать **несоответствия контрольной** суммы из-за различий в создании классов на клиенте и на сервере.

Если нужно отключить поддержку ssr то добавляем правило  к плагину

```json
plugins": [
    [
      "babel-plugin-styled-components",
      {
        "ssr": false
      }
    ]
  ]
```
Также существуют другие полезные настроки к плагину, которые описаны в доке.


Пример 

- Метод `collectStyles` **оборачивает** ваш элемент в провайдере  
- `Sheet.getStyleTags ()` **возвращает строку** из нескольких тегов <style>. Это необходимо учитывать при добавлении строки CSS в вывод HTML.  
- В качестве альтернативы экземпляр `ServerStyleSheet` также имеет метод `getStyleElement ()`, который возвращает массив элементов React.  
- Убедитесь, что `sheet.seal ()` вызывается только **после** того, как `sheet.getStyleTags ()` или `sheet.getStyleElement ()` были вызваны, иначе будет выдана другая ошибка.  

> **sheet.getStyleTags** () и **sheet.getStyleElement** () могут быть вызваны *только после визуализации вашего элемента*.  

```js
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

const sheet = new ServerStyleSheet();

try {
  const html = renderToString(sheet.collectStyles(<YourApp />))
  const styleTags = sheet.getStyleTags() // or sheet.getStyleElement();
} catch (error) {
  // handle error
  console.error(error)
} finally {
  sheet.seal()
}
```
При желании можно использовать StyleSheetManager напрямую, вместо этого метода. 
Просто убедитесь, что не используете его на стороне клиента.

```js
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

const sheet = new ServerStyleSheet()
try {
  const html = renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <YourApp />
    </StyleSheetManager>
  )
  const styleTags = sheet.getStyleTags() // or sheet.getStyleElement();
} catch (error) {
  // handle error
  console.error(error)
} finally {
  sheet.seal()
}
```

### nextjs_setup

Сетап в `NEXT`

[next setup example](https://github.com/zeit/next.js/tree/master/examples/with-styled-components)
