import {hot} from 'react-hot-loader/root';
import React from 'react'
import './style.css';

class App extends React.Component {
	state ={
		counter: 0
	}
	render (){
		return (
			<>
				<h1 style={{color: `${this.state.counter > 4 ? 'yellow': 'blue'}`}}>I React boilerplate</h1>
				<span>{this.state.counter}</span>
				<button onClick={()=> this.setState(prevState => ({counter: prevState.counter +1}))}>+</button>
				<button onClick={()=> this.setState(prevState => ({counter: prevState.counter -1}))}>-</button>

			</>
		)
	}
}

export default hot(App);