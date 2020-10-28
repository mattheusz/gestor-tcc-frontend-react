import React, { useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import styled, { ThemeProvider } from 'styled-components';
import { Paragraph, Heading2 } from '../styled';
import lightTheme from '../themes/light'
import { FaEnvelope } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import useInput from '../hooks/useInput';
import BannerIFF from '../components/BannerIFF';
import CenterForm from '../components/CenterForm';
import IconTextField, { Input } from '../components/IconTextField';
import Button from '../components/Button';
import SimpleLink from '../components/SimpleLink';
import Container from '../components/Container';
import ErrorMessage from '../components/Error/ErrorMessage';
import { AuthContext } from '../context/AuthContext';

function ForgotPassword(props) {

    const { register, handleSubmit, errors, formState } = useForm({
        mode: 'onBlur'
    })

    const { handleForgotPassword, errorMessage, setErrorMessage } = useContext(AuthContext)

    useEffect(() => {
        setErrorMessage('')
    }, [])

    const onSubmit = ({ email }) => {
        handleForgotPassword(email)
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <Container>
                <BannerIFF />
                <CenterForm onSubmit={handleSubmit(onSubmit)}>
                    <ForgotIcon />
                    <Heading2>Problemas para entrar?</Heading2>
                    <Paragraph>
                        Insira o seu e-mail e enviaremos um link para você voltar a acessar a sua conta.
                    </Paragraph>
                    <IconTextField>
                        <FaEnvelope />
                        <Input
                            type='text'
                            name='email'
                            id='email'
                            ref={register({
                                required: true,
                                pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                            })}
                            placeholder='E-mail'
                            style={errors.email && { borderColor: lightTheme.color.secondary }}
                        />
                    </IconTextField>
                    {errors.email && errors.email.type === 'required' && <ErrorMessage left>O e-mail é obrigatório</ErrorMessage>}
                    {errors.email && errors.email.type === 'pattern' && <ErrorMessage left>Digite um e-mail válido</ErrorMessage>}
                    <Button type='submit' disabled={formState.isSubmitted}>Enviar link para login</Button>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <SimpleLink to='/login'>Voltar para o Login</SimpleLink>
                </CenterForm>
                <ToastContainer />
            </Container>
        </ThemeProvider>
    );
}

export default ForgotPassword;

const ForgotIcon = styled(BsFillShieldLockFill)`
    margin-top: .7rem;
    margin-bottom: .7rem;
    margin-left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    width: 50px;
    max-width: 70px;
    height: auto;
    color: ${props => props.theme.color.secondary};
`
