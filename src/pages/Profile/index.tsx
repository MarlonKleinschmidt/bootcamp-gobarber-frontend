// importações --------------------------------------------------------
import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

// interfaces --------------------------------------------------------
interface ProfileFormDate {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

// componente --------------------------------------------------------
// Componte (página) de cadastro de usuário...
const Profile: React.FC = () => {

  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();

  const { user, updateUser } = useAuth();

  // Função de submit do formulário ...
  const handleSubmit = useCallback(async (data: ProfileFormDate) => {

    try {

      formRef.current?.setErrors({});

      // Monta a forma dos dados e mensagens de validação ...
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um email válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }).oneOf(
          [Yup.ref('password'), undefined],
          'Confirmação de senha incorreta',
        ),
      });

      // Chama função de validação do Yup...
      await schema.validate(data, {
        abortEarly: false,
      });

      // pega os dados do formulário
      const { name, email, old_password, password, password_confirmation } = data;

      // monta os dados do formulario que foram enviados, só nome email, ou com a senha junto
      const formData = Object.assign({
        name,
        email,
      }, old_password ?
        {
          old_password,
          password,
          password_confirmation,
        } :
        {});

      // chama a api passando a variavel formData como parâmetro para realizar o update ...
      const response = await api.put('/profile', formData);

      // atualiza o localstorage para recarregar os campos do usuario.
      updateUser(response.data);

      // redireciona para o dashboard ...
      history.push('/dashboard');

      // Exibe mensagem de sucesso ...
      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        description: 'Informações do Perfil atualizadas com sucesso!',
      });


    } catch (err) {

      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      // disparar um toast caso erro na atualização
      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: 'Ocorreu um erro ao atualizar perfil, tente novamente.',
      });

    }
  }, [addToast, history,updateUser]);

  // Função para atualizar a imagem do perfil ...
  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {

    if (e.target.files) {

      // FormData() - Essa interface utiliza o mesmo formato que um form utilizaria
      // se o tipo de codificação estivesse configurado como "multipart/form-data".
      const data = new FormData();
      data.append('avatar', e.target.files[0]);
      api.patch('/users/avatar', data).then((response) => {
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        });
      });
    }

  }, [addToast, updateUser]);


  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="Email" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha" />
          <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar Senha" />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>

      </Content>
    </Container>
  );
}

export default Profile;
