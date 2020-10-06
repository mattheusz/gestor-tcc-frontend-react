import React, { useEffect, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import HeaderDefault from '../components/HeaderDefault';
import { Button, Form, Input, InputGroup, Paragraph, SimpleLink, SubmitButton, SubTitle, Wrapper } from '../styled';
import lightTheme from '../themes/light'
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcLock } from "react-icons/fc";
import { BsFillShieldLockFill } from "react-icons/bs";
import useInput from '../hooks/useInput';

function ForgotPassword(props) {

    const [email, bindEmail] = useInput('');

    const inputEmailRef = useRef(null)

    useEffect(() => {
        inputEmailRef.current.focus()
    }, [])

    const onFormSubmit = e => {
        e.preventDefault();
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <Wrapper>
                <HeaderDefault />
                <Form onSubmit={onFormSubmit}>
                    <ForgotIcon />
                    <SubTitle>Problemas para entrar?</SubTitle>
                    <Paragraph>
                        Insira o seu e-mail e enviaremos um link para você voltar a acessar a sua conta.
                    </Paragraph>
                    <InputGroup>
                        <FaEnvelope />
                        <Input type='email' placeholder='E-mail' {...bindEmail} ref={inputEmailRef} />
                    </InputGroup>
                    <SubmitButton>Enviar link para login</SubmitButton>
                    <SimpleLink to='/login'>Voltar para o Login</SimpleLink>
                </Form>
            </Wrapper>
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
