import React from 'react';
import 'mutationobserver-shim';
import { render,fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

// Utilizar a função mock do jest para alterar o valor das propriedades
// useHistory e Link.
// Colocar o comando fora do describe para que sirva para todos os testes.
jest.mock('react-router-dom', ()=>{
    return {
        useHistory: ()=> ({
            push: mockedHistoryPush,
        }),
        Link: ({children }: { children: React.ReactNode }) => children,
    };   
});

// Função mock para alterar a execução da chamada da api.
jest.mock('../../hooks/auth', ()=>{
    return {
        useAuth: ()=> ({
            signIn: mockedSignIn,          
        }),
    }
});

// mock para alterar a execução da chamada da api.
jest.mock('../../hooks/toast', ()=>{
    return {
        useToast: ()=> ({
            addToast: mockedAddToast,          
        }),
    }
});

describe('SignIn Page', ()=>{  

    // disparar uma função antes de executar cada um dos testes
    beforeEach(()=>{
        mockedHistoryPush.mockClear();
    });
    
    
    it('should be able to sign in', async () => {
        const { getByPlaceholderText, getByText } =  render(<SignIn />); 
        const emailField = getByPlaceholderText('Email'); 
        const passwordField = getByPlaceholderText('Senha'); 
        const buttonElement = getByText('Entrar');
       
        //fireEvent.change -> simula o evento preencher do usuário.
        fireEvent.change(emailField, { target: {value: 'qqer@example.com'} })
        fireEvent.change(passwordField, { target: {value: '123456'} })

        // fireEvent.click - simula o evento click ;)  
        fireEvent.click(buttonElement);

        // após o click é esperado o redirecionamento para pagina dashboard.
        //await wait(()=>{
          //  expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
        //});
        // Função wait nao é mais implementada na lib, alterei para waitFor
        // instalar dependencia de desenvolvimento 'mutationobserver-shim'
        // importar no inicio do arquivo para parar o erro de 
        // "MutationObserver is not a constructor"
        await waitFor( () => { 
            expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');            
        });
    });
    
    it('should not be able to sign in with invalid credentials', async () => {
        const { getByPlaceholderText, getByText } =  render(<SignIn />); 
        const emailField = getByPlaceholderText('Email'); 
        const passwordField = getByPlaceholderText('Senha'); 
        const buttonElement = getByText('Entrar');
       
        //fireEvent.change -> simula o evento preencher do usuário.
        fireEvent.change(emailField, { target: {value: 'not-valid-email'} })
        fireEvent.change(passwordField, { target: {value: '123456'} })

        // fireEvent.click - simula o evento click ;)  
        fireEvent.click(buttonElement);

        // esperado que não seja chamada a função mockedHistoryPush.
        await waitFor( () => { 
            expect(mockedHistoryPush).not.toHaveBeenCalled();            
        });
    });


    it('should display an error if login fails', async () => {
        
        mockedSignIn.mockImplementation(()=>{
            throw new Error;
        });

        const { getByPlaceholderText, getByText } =  render(<SignIn />); 
        const emailField = getByPlaceholderText('Email'); 
        const passwordField = getByPlaceholderText('Senha'); 
        const buttonElement = getByText('Entrar');
       
        //fireEvent.change -> simula o evento preencher do usuário.
        fireEvent.change(emailField, { target: {value: 'qqr@example.com'} })
        fireEvent.change(passwordField, { target: {value: '123456'} })

        // fireEvent.click - simula o evento click ;)  
        fireEvent.click(buttonElement);

        // esperado que não seja chamada a função mockedHistoryPush.
        await waitFor( () => { 
            expect(mockedAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'error',
                }),
            );            
        });

    });

});