// importações -----------------------------------------------
import React from 'react';

import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';

// Interface RouteProps recebe todas as propriedades,e adiciona +.
interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  // Sobreescreve a tipagem do component para receber,
  // o componente apenas com o nome da pagina.
  component: React.ComponentType;
}

// Componente -----------------------------------------------
// Route - Verifica se o usuário está logado ...
const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
