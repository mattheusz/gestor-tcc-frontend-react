import React, { useContext } from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Home from '../pages/Home';
import Projetos from '../pages/Projetos';
import Alunos from '../pages/Alunos';
import { AuthContext, AuthProvider } from '../context/AuthContext';

function CustomRoute({ isPrivate, ...rest }) {
    const { authenticated, loading } = useContext(AuthContext)

    console.debug('Custom Route running', authenticated)

    if (loading) {
        return <h1>Loading...</h1>;
    }

    console.debug('Privado | Autenticado', isPrivate, ' | ', authenticated)
    if (isPrivate && !authenticated) {

        return <Redirect to='/login' />
    }

    if (!isPrivate && authenticated) {
        return <Redirect to='/home' />
    }

    console.log('Rota com rest sendo chamada');
    return <Route {...rest} />

}

export default function Routes() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Switch>
                    <CustomRoute exact path='/login' component={Login} />
                    <CustomRoute exact path='/forgot_password' component={ForgotPassword} />
                    <CustomRoute exact path='/reset_password' component={ResetPassword} />
                    <CustomRoute exact isPrivate path='/home' component={Home} />
                    <CustomRoute exact isPrivate path='/projetos' component={Projetos} />
                    <CustomRoute exact isPrivate path='/alunos' component={Alunos} />
                    <CustomRoute exact path='/'>
                        <Link to='/login'>Login</Link><hr />
                        <Link to='/forgot_password'>Esqueci a senha</Link><hr />
                        <Link to='/reset_password/:id'>Resetar a senha</Link><hr />
                        <Link to='/home'>Home (em construção)</Link>
                    </CustomRoute>
                </Switch>
            </AuthProvider>
        </BrowserRouter>

    );
}