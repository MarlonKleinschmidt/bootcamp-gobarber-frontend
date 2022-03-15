// importações --------------------------------------------------------
import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Container, Content, AnimationContainer, Background } from './styles';

// interfaces --------------------------------------------------------
interface SignUpFormDate {
  name: string;
  email: string;
  password: string;
}

// componente --------------------------------------------------------

// Componte (página) de cadastro de usuário...
const SignUp: React.FC = () => {

  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();

  // Função de submit do formulário ...
  const handleSubmit = useCallback(async (data: SignUpFormDate) => {
    try {
      formRef.current?.setErrors({});

      // Monta a forma dos dados e mensagens de validação ...
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });
      // ...

      // Chama função de validação...
      await schema.validate(data, {
        abortEarly: false,
      });
      // ...

      // chama a api de cadastro ...
      await api.post('/users', data);
      // ...

      // redireciona para a raiz da aplicação ...
      history.push('/');
      // ...

      // Exibe mensagem de sucesso ...
      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer seu logon no GoBarber!',
      });


    } catch (err) {

      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      // disparar um toast caso erro na autenticação...
      addToast({
        type: 'error',
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.',
      });

    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
        Voltar para logon
        </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
}
// ...

export default SignUp;
