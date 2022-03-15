import React, { createContext, useCallback, useState, useContext } from 'react';
import ToastContainer from '../components/ToastContainer';
import { v4 as uuid } from 'uuid';

//------------ interfaces --------------------------------------------
export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

//------------ componentes / exportaçõs----------------------------------
// Contexto - variável que ficará acessível na aplicação.
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

// Componente ToastProveider ...
const ToastProvider: React.FC = ({ children }) => {

  const [messages, setMessages] = useState<ToastMessage[]>([]);

  // adiciona toast ...
  const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
    const id = uuid();
    const toast = {
      id,
      type,
      title,
      description
    };
    setMessages((state) => [...state, toast]);
  }, []);
  //...

  // Remove um toast...
  const removeToast = useCallback((id: string) => {
    // busca todos os toasts dentro de message !== diferente do id.
    setMessages(state => state.filter(message => message.id !== id))
  }, []);
  // ...

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>

  )
}
// ...

// Hook useToast - vai retornar os dados contidos no contexto de toast...
function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
// ...

export { ToastProvider, useToast };
