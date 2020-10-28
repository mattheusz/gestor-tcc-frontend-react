import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from '../api/api'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    let history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.debug('Token:', token)
            api.defaults.headers.Authorization = `Bearer ${token}`;
            setAuthenticated(() => true);
            console.debug('isAuthenticated', authenticated)
        }
        setLoading(false);
    }, [authenticated])

    async function handleLogin(registration, password) {
        console.debug('HandleLogin', `Fetching...`, registration, password);

        await api.post('/login', {
            registration,
            password,
        })
            .then(response => {
                const token = JSON.stringify(response.data.token);

                localStorage.setItem('token', `Bearer ${token}`);
                api.defaults.headers.Authorization = `Bearer ${token}`;
                setAuthenticated(true);
                history.push('/home');
            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    setErrorMessage(msg);
                    console.log(errorMessage);
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }

    async function handleForgotPassword(email) {
        console.debug('HandleLogin', `Fetching...`, email);

        await api.post('/esqueci_minha_senha', {
            email,
        })
            .then(response => {
                console.log(response)
                const notify = () => toast.success("Link de validação enviado com sucesso. Acesse o seu e-mail", {

                });
                notify()

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    setErrorMessage(msg);
                    console.log(errorMessage);
                }
                if (error.request) {
                    const msg = error.response.data;
                    setErrorMessage(msg);
                    console.log(error.response.data);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }

    return (
        <AuthContext.Provider value={{ authenticated, loading, handleLogin, handleForgotPassword, errorMessage, setErrorMessage }}>
            {children}
        </AuthContext.Provider>
    )
}
