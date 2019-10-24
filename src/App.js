/* eslint-disable react/state-in-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
import { hot } from 'react-hot-loader/root';
import React from 'react';

const Message = React.lazy(() => import('./warning.jsx'));

class App extends React.Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <>
        <h1 style={{ color: `${this.state.counter > 4 ? 'yellow' : 'blue'}` }}>
          I React boilerplate
        </h1>
        <span>{this.state.counter}</span>
        <button
          onClick={() =>
            this.setState(prevState => ({ counter: prevState.counter + 1 }))
          }
        >
          +
        </button>
        <button
          onClick={() =>
            this.setState(prevState => ({ counter: prevState.counter - 1 }))
          }
        >
          -
        </button>
        {this.state.counter === 5 && (
          <React.Suspense fallback={null}>
            <Message />
          </React.Suspense>
        )}
      </>
    );
  }
}

export default hot(App);
