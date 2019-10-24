import { hot } from 'react-hot-loader/root';
import React from 'react';
import './img/react_boilerplate.jpg';

const App = () => {
  return (
    <div className="title">
      <h1>React boilerplate</h1>
      <img
        className="boilerplate-image"
        src="./img/react_boilerplate.jpg"
        alt="react"
      />
    </div>
  );
};

export default hot(App);
