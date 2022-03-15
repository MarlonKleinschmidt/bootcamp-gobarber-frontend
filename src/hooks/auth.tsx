//------------ importações -------------------------------------------
import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';


//------------ interfaces --------------------------------------------

// Interface/tipagem do usuário
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

// (Type) Estrutura de dados do ESTADO de autenticação.
interface AuthState {
  token: string;
  user: User;
}

// (Type) Estrutura de dados do MÉTODO de autenticação.
interface SignInCredentials {
  email: string;
  password: string;
}

// (Type) Estrutura de dados do CONTEXTO(API) de autenticação.
interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}


//------------ componentes / exportaçõs----------------------------------
// Contexto - variável que ficará acessível na aplicação.
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Componente ...
export const AuthProvider: React.FC = ({ children }) => {
  // Lê informações do login(do localstorage) e atribui as variáveis token e user,
  // ou inicializa vazio...
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');
    if (token && user) {
      // Atribuir o header authorization passando o token ao atualizar a página (F5)...
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) } // retorna com os valors do localstorage.
    }
    return {} as AuthState; // retorna vazio.
  });
  //

  // metodo signIn, executa processo de autenticação...
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    // busca resposta da api e guarda no localstorage
    const { token, user } = response.data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // Atribuir o header authorization passando o token no login...
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user }); // atualiza variáveis com as vindas do formulário
  }, []);

  // metodo signOut, executa processo de logout da autenticação...
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  // metodo updateUser, executa a atualização do perfil...
  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    }, [setData, data.token]);



  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// ...

// função para acessar o contexto de autenticação...
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

 /* if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }*/
  return context;
};
// ...

