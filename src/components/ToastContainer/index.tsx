// importações ---------------------------------------------------
import React from 'react';
import { useTransition } from 'react-spring';
import Toast from './Toast'

import { ToastMessage } from '../../hooks/toast'
import { Container } from './styles'

// interfaces ---------------------------------------------------
interface ToastContainerProps {
  messages: ToastMessage[];
}

// componente ---------------------------------------------------
const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {

  // useTransitiom controla a transição de quando o elemento entra ou sai da tela.
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 }
    }
  );

  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
    </Container>
  )
};
// ...

export default ToastContainer;
