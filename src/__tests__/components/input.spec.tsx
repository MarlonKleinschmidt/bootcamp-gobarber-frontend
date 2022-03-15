
import React from 'react';
import 'mutationobserver-shim';

import { fireEvent, getByPlaceholderText, getByTestId, render, waitFor } from '@testing-library/react';
import Input from '../../components/Input';



// mock para o método useField.
jest.mock('@unform/core',()=> {
    return {
        useField() {
            return {
                fieldName: 'email',
                defaultValue: '',
                error: '',
                registerField: jest.fn(),
            };
        },
    };
})



// categoriza os testes
describe('Input component', ()=>{
    
    it('should be able to render an input', () => {
        const {getByPlaceholderText} = render(
            <Input name="email" placeholder="Email"/>
        );

        expect(getByPlaceholderText('Email')).toBeTruthy();
    });


    it('should render highlight on input focus', async () => {
        const {getByPlaceholderText, getByTestId} = render(
            <Input name="email" placeholder="Email"/>
        );

        // atribui a referencia do input para a variável
        const inputElement = getByPlaceholderText('Email');
        const containerElement = getByTestId('input-container');
        
        // clicar no input
        fireEvent.focus(inputElement);

        await waitFor( () => { 
            expect(containerElement).toHaveStyle('border-color: #ff9000;');
            expect(containerElement).toHaveStyle('color: #ff9000;');
        });

         // sair do input
         fireEvent.blur(inputElement);

         await waitFor( () => { 
             expect(containerElement).not.toHaveStyle('border-color: #ff9000;');
             expect(containerElement).not.toHaveStyle('color: #ff9000;');
         });

    });


    it('should keep input border highlight when input filled', async () => {
        const {getByPlaceholderText, getByTestId} = render(
            <Input name="email" placeholder="Email"/>
        );

        // atribui a referencia do input para a variável
        const inputElement = getByPlaceholderText('Email');
        const containerElement = getByTestId('input-container');
        
        // preencher o input    
        fireEvent.change(inputElement, {
            target: { value: 'qqr@example.com'}
        });    

        // sair do input
        fireEvent.blur(inputElement);

        await waitFor( () => { 
            expect(containerElement).toHaveStyle('color: #ff9000;');            
        });

    });


});