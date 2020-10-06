import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Route path='/login'>
        <Login />
      </Route>
      <Route path='/forgot_password'>
        <ForgotPassword />
      </Route>
      <Route path='/reset_password'>
        <ForgotPassword />
      </Route>
      <Route exact path='/'>

      </Route>
    </BrowserRouter>
  );
}

export default App;
