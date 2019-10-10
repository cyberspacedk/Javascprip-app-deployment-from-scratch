import React from 'react'

class App extends React.Component {
    state ={
        counter: 0
    }
    render (){
        return (
            <>
                <h1>I React boilerplate</h1>
								<span>{this.state.counter}</span>
								<button onClick={()=> this.setState(prevState => ({counter: prevState.counter +1}))}>+</button>
								<button onClick={()=> this.setState(prevState => ({counter: prevState.counter -1}))}>-</button>

            </>
        )
    }
}

export default App;