// importações  ----------------------------------------------
import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

// (TYPE) Estrutura de dados do formulário de reset de senha.
interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

// Componte (página) de reset de senha...
const ResetPassword: React.FC = () => {

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  // Função de submit do formulário ...
  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        password_confirmation: Yup.string()
          .oneOf([Yup.ref('password'), undefined], 'Confirmação de senha incorreta',
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      // Obtendo os dados do formulario para chamar a API-->
      const { password, password_confirmation } = data;
      const token = location.search.replace('?token=', '');

      // se não existir o token dipara um erro e encerra a rotina.
      if (!token) {
        throw new Error();
      }

      // chamar a API passando os dados do formulario mais o token da url
      await api.post('/password/reset', {
        password,
        password_confirmation,
        token,
      });
      // <--API.

      history.push('/');

    }
    catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      // disparar um toast caso erro no reset da senha...
      addToast({
        type: 'error',
        title: 'Erro ao resetar a senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
      });
    }
  },
    [addToast, history, location.search],
  );
  //  ...

  return (

    <Container>

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit} >
            <h1>Resetar senha</h1>
            <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
            <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação da senha" />
            <Button type="submit">Alterar senha</Button>
          </Form>

        </AnimationContainer>
      </Content>
      <Background />
    </Container >

  )
}
// ...

export default ResetPassword;
