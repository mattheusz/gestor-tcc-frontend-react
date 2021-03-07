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
    const [professorMode, setProfessorMode] = useState();
    //const [userType, setUserType] = useState('');
    let history = useHistory();

    const updateProfessorModeLocalAndState = (mode) => {
        localStorage.setItem('professorMode', mode);
        setProfessorMode(mode);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        //const type = localStorage.getItem('userType');
        if (token) {
            api.defaults.headers.Authorization = `${token}`;

            const decoded = jwt_decode(token);
            console.debug('TOKEN DECODED: ', decoded);
            const { userType, isCoordinator, available, id, name } = decoded;
            const userTypeDetected = detectUserType(userType, isCoordinator, available);
            console.log('Tipo de usuário detectado: ', userTypeDetected);
            localStorage.setItem('userType', userTypeDetected);
            localStorage.setItem('reg', id);
            localStorage.setItem('username', name);
            let localProfessorMode = localStorage.getItem('professorMode');
            let isTrueLocalProfessorMode = (localProfessorMode == "true");
            console.debug('PROFESSOR MODE', professorMode)
            if (!isTrueLocalProfessorMode) {
                localProfessorMode = false;
                localStorage.setItem('professorMode', localProfessorMode);
            }
            else {
                localStorage.setItem('professorMode', localProfessorMode);
            }

            setProfessorMode(localProfessorMode);

            setAuthenticated(() => true);
        }
        setLoading(false);
    }, [professorMode])

    async function handleLogin(registration, password) {
        console.debug('HandleLogin', `Fetching...`, registration, password);

        await api.post('/login', {
            registration,
            password,
        })
            .then(response => {
                const token = response.data.token;

                localStorage.setItem('token', `Bearer ${token}`);
                api.defaults.headers.Authorization = `Bearer ${token}`;

                const decoded = jwt_decode(token);
                console.debug('TOKEN DECODED: ', decoded);
                const { userType, isCoordinator, available, id, name, profilePicture } = decoded;
                const userTypeDetected = detectUserType(userType, isCoordinator, available);
                localStorage.setItem('userType', userTypeDetected);
                localStorage.setItem('reg', id);
                localStorage.setItem('username', name)
                localStorage.setItem('urlProfileImage', profilePicture.url);
                localStorage.setItem('professorMode', false);

                setAuthenticated(true);
                history.push(`/${userTypeDetected}`);
            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    setErrorMessage(msg);
                    console.log(msg);
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
                    const msg = JSON.stringify(error.request);
                    setErrorMessage(msg);
                    console.log(msg);
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

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('urlProfileImage');
        localStorage.removeItem('username');
        localStorage.removeItem('professorMode');
        localStorage.removeItem('reg');
        api.defaults.headers.Authorization = ``;
        setAuthenticated(false);
        history.push('/login')
    }

    return (
        <AuthContext.Provider value={{
            authenticated,
            loading,
            handleLogin,
            handleForgotPassword,
            handleResetPassword,
            errorMessage,
            setErrorMessage,
            logout,
            professorMode,
            updateProfessorModeLocalAndState
        }
        }>
            {children}
        </AuthContext.Provider>
    )
}
