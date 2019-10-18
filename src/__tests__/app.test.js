 import React from 'react';
 import App from '../App.jsx';
 import {render} from '@testing-library/react' 

describe('test', ()=>{

    it('check', ()=> {
        expect(true).toBe(true)
        render(<App />)
    })

})