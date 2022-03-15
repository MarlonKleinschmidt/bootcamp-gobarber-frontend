import React from 'react';
import { renderHook , act} from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../../hooks/auth';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';


const apiMock = new MockAdapter(api);

const apiResponse = {
    user:{
        id: 'user123',
        name: 'QQr',
        email: 'qqr@example.com',
    },
    token: 'token-123',
}

describe('Auth hook', ()=>{

    it('should be able to sign in', async ()=>{

        apiMock.onPost('sessions').reply(200,apiResponse);

        // descobrir se uma determinada função foi disparada
        // nao funciona desta maneira, usar o Storage.prototype
        //const setItemSpy = jest.spyOn(localStorage, 'setItem');
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        // chama o hook
        const { result, waitForNextUpdate} = renderHook(()=> useAuth(),{
            wrapper: AuthProvider,
        });
        
        result.current.signIn({
            email: 'qqr@example.com',
            password: '123456',
        });

        await waitForNextUpdate();

        expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', apiResponse.token);
        expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(apiResponse.user));
        expect(result.current.user.email).toEqual('qqr@example.com');
    });


    it('should restore saved data from storage when auth inits',()=>{

        // mockImplementation - substitui o comportamento do método por outro.
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch (key){
                case '@GoBarber:token':
                    return 'token-123';
                case '@GoBarber:user':
                    return JSON.stringify({
                        id: 'user123',
                        name: 'QQr',
                        email: 'qqr@example.com',
                    });
                    default:
                        return null;
            }
        });

        // chama o hook
        const { result } = renderHook(()=> useAuth(),{
            wrapper: AuthProvider,
        });

        expect(result.current.user.email).toEqual('qqr@example.com');

    });


    it('should be able to sign out', async () =>{

        // inicializar o usuario com os dados 
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch (key){
                case '@GoBarber:token':
                    return 'token-123';
                case '@GoBarber:user':
                    return JSON.stringify({
                        id: 'user123',
                        name: 'QQr',
                        email: 'qqr@example.com',
                    });
                    default:
                        return null;
            }
        });

        // verifica se a função removeItem foi chamada
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        // chama o hook
        const { result } = renderHook(()=> useAuth(),{
            wrapper: AuthProvider,
        });

        act(()=>{
            result.current.signOut()
        });              

        expect(removeItemSpy).toHaveBeenCalledTimes(2);
        expect(result.current.user).toBeUndefined();
    });

    it('should be able to update user data', async () => {
        
        // verifica se a função setItem foi chamada
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        // chama o hook
        const { result } = renderHook(()=> useAuth(),{
            wrapper: AuthProvider,
        });

        const user = {
            id: 'user123',
            name: 'QQr',
            email: 'qqr@example.com',
            avatar_url: 'image-test.jpg',

        }

        act(()=>{
            result.current.updateUser(user);
        });

        expect(setItemSpy).toHaveBeenCalledWith(
            '@GoBarber:user',
            JSON.stringify(user),
        );

        expect(result.current.user).toEqual(user);

    });

});