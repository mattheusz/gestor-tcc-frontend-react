import React, { Fragment } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassowrd from './pages/ResetPassowrd';
import Home from './pages/Home';

function App() {
  return (
    <>

      <BrowserRouter>

        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/forgot_password'>
          <ForgotPassword />
        </Route>
        <Route path='/reset_password'>
          <ResetPassowrd />
        </Route>
        <Route path='/home'>
          <Home />
        </Route>
        <Route exact path='/'>
          <Link to='/login'>Login</Link><hr />
          <Link to='/forgot_password'>Esqueci a senha</Link><hr />
          <Link to='/reset_password'>Resetar a senha</Link><hr />
          <Link to='/home'>Home (em construção)</Link>
        </Route>

      </BrowserRouter>
    </>
  );
}

export default App;
