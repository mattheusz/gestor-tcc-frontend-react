import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form'

import { ThemeProvider } from 'styled-components'
import lightTheme from '../themes/light'
import { FaAddressCard, FaLock } from "react-icons/fa";
import BannerIFF from '../components/BannerIFF';
import CenterForm from '../components/CenterForm';
import Container from '../components/Container'
import IconTextField, { Input } from '../components/IconTextField';
import SimpleLink from '../components/SimpleLink'
import Button from '../components/Button'
import Logo from '../components/Logo'
import Brand from '../components/Brand/Brand';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/Error/ErrorMessage';


function Login(props) {
    const { register, handleSubmit, errors } = useForm({
        mode: "onSubmit"
    });

    const { handleLogin, errorMessage, setErrorMessage } = useContext(AuthContext)

    useEffect(() => {
        setErrorMessage('')
    }, [])

    const onSubmit = ({ registration, password }) => {
        console.log(registration, password)
        handleLogin(registration, password);
    }

    console.debug(Login, 'fui chamado ñ sei pq')


    return (
        <ThemeProvider theme={lightTheme}>
            <Container>
                <BannerIFF />
                <CenterForm onSubmit={handleSubmit(onSubmit)} >
                    <Brand extraLarge>
                        Gestor de <span>TCC</span>
                    </Brand>
                    <IconTextField>
                        <FaAddressCard />
                        <Input
                            type='text'
                            name='registration'
                            id='registration'
                            ref={register({
                                required: true,
                            })}
                            placeholder='Matrícula'
                            autoFocus
                            style={errors.registration && { borderColor: lightTheme.color.secondary }}
                        />
                    </IconTextField>
                    {errors.registration && errors.registration.type === 'required' && <ErrorMessage left>A matrícula é obrigatória</ErrorMessage>}

                    <IconTextField>
                        <FaLock />
                        <Input
                            type='password'
                            name='password'
                            ref={register({
                                required: true,
                                minLength: 8
                            })}
                            placeholder='Senha'
                            style={errors.password && { borderColor: lightTheme.color.secondary }}
                        />
                    </IconTextField>
                    {errors.password && errors.password.type === 'required' && <ErrorMessage left>A senha é obrigatória</ErrorMessage>}
                    {errors.password && errors.password.type === 'minLength' && <ErrorMessage left>A senha deve conter no mínimo 8 caracteres</ErrorMessage>}

                    <Button type='submit' >Entrar
                    </Button>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <SimpleLink to='/forgot_password'>Esqueceu a senha?</SimpleLink>

                </CenterForm>
            </Container>
        </ThemeProvider>
    );
}

export default Login;



