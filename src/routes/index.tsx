// importações --------------------------------------------------
import React from 'react';
// Switch vai garantir que apenas uma rota seja mostrada a cada momento.
// Route é cada rota que da aplicação.
import { Switch } from 'react-router-dom';
import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';

// componente ...
const Routes: React.FC = () => (
  <Switch>
    <Route path='/' exact component={SignIn} />
    <Route path='/signup' component={SignUp} />
    <Route path='/forgot-password' component={ForgotPassword} />
    <Route path='/reset-password' component={ResetPassword} />

    <Route path='/profile' component={Profile} isPrivate />
    <Route path='/dashboard' component={Dashboard} isPrivate />
  </Switch>
);
//...

export default Routes;




