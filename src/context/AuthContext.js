import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from '../api/api'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { detectUserType } from '../utils/detectUserType'

import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    //const [userType, setUserType] = useState('');
    let history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        //const type = localStorage.getItem('userType');
        if (token) {
            api.defaults.headers.Authorization = `${token}`;

            const decoded = jwt_decode(token);
            console.log(decoded)
            const { userType, isCoordinator, available } = decoded;
            const userTypeDetected = detectUserType(userType, isCoordinator, available);
            console.log('Tipo de usuário detectado: ', userTypeDetected);
            localStorage.setItem('userType', userTypeDetected);

            setAuthenticated(() => true);
        }
        setLoading(false);
    }, [])

    async function handleLogin(registration, password) {
        console.debug('HandleLogin', `Fetching...`, registration, password);

        await api.post('/login', {
            registration,
            password,
        })
            .then(response => {
                const token = response.data.token;
                console.log('Token recebido da API: ', token);

                localStorage.setItem('token', `Bearer ${token}`);
                api.defaults.headers.Authorization = `Bearer ${token}`;

                const decoded = jwt_decode(token);
                console.log(decoded)
                const { userType, isCoordinator, available } = decoded;
                const userTypeDetected = detectUserType(userType, isCoordinator, available);
                console.log('Tipo de usuário detectado: ', userTypeDetected);
                localStorage.setItem('userType', userTypeDetected);

                setAuthenticated(true);
                history.push(`/${userTypeDetected}`);
            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    setErrorMessage(msg);
                    console.log('Mensagem de erro sendo seta, o que re-renderiza o Login');
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

    async function handleResetPassword(password, confirmPassword, token) {
        console.debug('HandleLogin', `Fetching...`, password, confirmPassword, token);

        await api.post('/resetar_senha', {
            token,
            password,
            confirmPassword,
        })
            .then(response => {
                console.log(response)
                const notify = () => toast.success("Senha recuperada com sucesso. Você será redirecionado para fazer login.", {
                    autoClose: 4000,
                });
                notify()
                setTimeout(() => {
                    history.replace('/login')
                }, 4000)

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
        <AuthContext.Provider value={{ authenticated, loading, handleLogin, handleForgotPassword, handleResetPassword, errorMessage, setErrorMessage }}>
            {children}
        </AuthContext.Provider>
    )
}
