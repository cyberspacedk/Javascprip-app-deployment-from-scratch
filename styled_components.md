![pic](http://i.piccy.info/i9/ec5c91dae17c0a0970b9e708b5255c8e/1556390885/40738/1314369/1_6E_EG6HczqSSsEQFgFlG_A.jpg)

1.  [Простая стилизация](#Simple_style)
2.  [Используем переменные](#Using_variables)
3.  [Hover](#Hover)
4.  [Наследование стилей](#Nested_style)
5.  [Стили для дочерних елементов](#Styling_Children)
6.  [Клонирование компоненты](#Deep_clone)
7.  [Медиа правила](#Media_Queries)
8.  [Хелперы](#СSS_helper)
9.  [Миксины](#Mixins)
10. [Глобальные стили](#Global_Styles)
11. [HOC Styled](#HOC_Styled)
12. [Extendible style system](#Extendible_style_system)
13. [Polished](#Polished)

Для использования ставим `npm` пакет

```js
npm i styled-component
```

Затем импортируем там где пишем стили

```jsx
import styled from "styled-components";
```
  
### Simple_style

Создаем компонент, записываем в поле `styled` тот `html` тег который появится в разметке
В шаблонной строке пишем обычный `css`

```jsx
const Button = styled.button`
  padding: 25px;
  background-color: palevioletred;
  border: none;
  margin: 20px;
`;
```

### Using_variables

Можно использовать переменные подобно `SASS`. для использования применяем втавку в шаблонную строку JS `${variable}`

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

### Hover

Если ховер срабатывает на родительском елементе, то синтаксис подобно scss.

`&:hover{....}`

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

Если ховер на должен отработать на другом/дочернем елементе то нужно вставить тот компонент или елемент на котором должны проихойти изменения

```jsx
// При наведении на родителя стили сработают

const Controls = styled.div`
  //на компоненте `Buttom`
  &:hover ${Button} {
    background-color: #ccc;
  }

  // на елементе `h2`
  &:hover h2 {
    width: 400px;
  }
`;
```

### Nested_style

- метод `syled()` - позволяет наследоваться от другой компоненты

Если необходимо **наследовать** стили от другой компоненты, то следует передать этот компонент в метод `styled(...)`, 
Если необходимо **переопределить/добавить** наследуемые стили, то это можно сделать в шаблонке.

```jsx
// Наследуемся от компоненты ё и переопределям только цвет шрифта
const Cancel = styled(Button)`
  color: "#fff";
`;
```

### Styling_Children

Чтобы не создавать новый `styled` компонент, можно в родительском `css styled` блоке писать правила для вложенных елементов, по селектору (класса, тега)

```jsx
// Родительский блок
const Appheader = styled.header`
  padding: 10px;
  text-align: center;
  // селектор дочернего елемента, можно и по селектору тега span
  .color {
    background-color: yellow;
    border: 2px solid #000;
    font-weight: 800;
  }
`;

//---------
<Appheader>
  <span className="color">App header</span>
</Appheader>;
```

### Deep_clone 

Выбираем компонент который хотим наследовать, передаем ему в `props` `className` и назначаем его в оберточном елементе. 
Пустой `className` нужен ВЕРОЯТНО для того чтобы `react` **не назначал** свой

```jsx
const Description = ({ className }) => (
  <div className={className}>
    <p>Some text</p>
    <span>description</span>
  </div>
);
```

Создаем копию вызвав метод `styled` куда передаем наследуемый компонент. в бэктиках переназначаем если необходимо стили для каждго из елементов можно отдельно

```jsx
const SubDescription = styled(Description)`
  p {
    padding: 0 30px;
    font-weight: 700;
  }
  span {
    color: blue;
  }
`;
```

### Media_Queries

Указываем директиву `@media`, учтоянем условия и в блоке кода пишем `{ стили для медиа условия}`. 
Можно внутри указывать компонент и назначать стили для него

```jsx
/
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

### СSS_helper

Можно напистаь **переменную**, **миксин/хелпер** и использовать в стилях компонента.

- **если** хелпер **это просто набор** css правил **то пишем без вызова метода css**
- **если** в хелпере **будут вызываться функции или динамически подставляться пропсы, тогда нужно заимпортить css модуль из styled-component**

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

Используем этот хелпер например в медиаправилах.

```jsx
// кнопка
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

Миксины 
- **которые принимают параметры** создаются путем объявления **функциональной компонеты**, 
- **простые миксины** как **переменные**

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

- импортировать createGlobalStyle из styled-components

```jsx
import { createGlobalStyle } from "styled-components";
```

- в корне scr создать файл например Globalstyles

- в файле создать переменную, куда прописать все глобальные стили

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

- заимпортить переменную в App компоненте и поместить ее в конец компоненты

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

### HOC_Styled

Использование `styled hoc` - оборачиваем созданный компонент , стилизуем его и експортируем дальше

Создадим компонент. Нужно не забыть заглушить поле `className` чтобы гарантированно поставились НАШИ стили.

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

Обернем его в `styled HOC` и зададим стили для всего блока и для вложенных также

```jsx
export default styled(Footer)`
  padding: 10px;
  background-color: aquamarine;
  p {
    text-align: center;
  }
`;
```

### Extendible_style_system

Для создания расширяемых стилевых оформлений будем использовать вызов функции в свойстве, и в зависимости от переданного аргумента, возвращать определенный `css`

Рассмотрим на примере кнопки, таких элементов  в проэкте обычно достаточно много и отличаются они в основном цветом/размером/текстом

- создадим базовые стили 

```js

export const Button = styled.button`
  padding: 5px 20px;
  border-radius: 5px;
  color: white;
  font-size: 2rem;
  border: none;
  background: teal;
// здесь будем вызывать ф-ции которые возвращают `css` в зависимости от переданных аргументов
  ${({size})=> {
    if(size === 'small'){
      return `
        font-size: 1rem;
        padding: 3px 10px
      `
    }
  }};
  ${({type}) => {
    if(type === 'cancel'){
      return `
        background: red;
      `
    }
  }}
`;
```

В местах использования кнопок, передаем в виде пропсов отличительные характеристики 

```js
export { Button } from './buttons'


...code 

<Button size="small" />
<Button size="small" type="cancel"/> 

```
Таким способом можно создавать один UI компонент и использовать с разными модификаторами

### Polished 

Библиотека с CSS функциями, миксинами и прочими "облегчалками". Аналог `lodash` для js.

[read docs ...](https://polished.js.org/docs/#normalize)