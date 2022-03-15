// importações ----------------------------------------------
import React, { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { ToastMessage, useToast } from '../../../hooks/toast';
import { Container } from './styles';

// interfaces ---------------------------------------------
interface ToastProps {
  message: ToastMessage;
  style: object;
}

// declaração de variáveis --------------------------------
// objeto icons ...
const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};
//...

// componente Toast ...
const Toast: React.FC<ToastProps> = ({ message, style }) => {

  // acessa o método removeToast dentro do hook.
  const { removeToast } = useToast();

  // remove um toast 3 segundos após ser criado...
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);
  // ...


  return (
    <Container
      type={message.type}
      hasDescription={Number(!!message.description)}
      style={style}
    >

      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}

      </div>
      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>

    </Container>
  )
}

export default Toast;
