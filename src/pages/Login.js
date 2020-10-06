import React, { useEffect, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components'
import lightTheme from '../themes/light'
import { FaAddressCard, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom'
import HeaderDefault from '../components/HeaderDefault';
import { Wrapper, Form, InputGroup, Input, Button, SimpleLink, SubmitButton } from '../styled';


function Login(props) {
    const [registration, setRegistration] = useState('');
    const [senha, setSenha] = useState('');
    const [errorLogin, setErrorLogin] = useState('');

    const inputMatriculaRef = useRef(null);
    useEffect(() => {
        inputMatriculaRef.current.focus();
    }, [])

    const onFormSubmit = e => {
        e.preventDefault();
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <Wrapper>
                <HeaderDefault />
                <Form onSubmit={onFormSubmit}>

                    <Title>
                        Gestor de <span>TCC</span>
                    </Title>
                    <InputGroup>
                        <FaAddressCard />
                        <Input
                            value={registration}
                            placeholder='Matrícula'
                            onChange={(e) => setRegistration(e.target.value)}
                            ref={inputMatriculaRef}
                            type='text'
                        />
                    </InputGroup>


                    <InputGroup>
                        <FaLock />
                        <Input
                            value={senha}
                            placeholder='Senha'
                            onChange={(e) => setSenha(e.target.value)}
                            type='password'
                        />
                    </InputGroup>

                    <SubmitButton type='submit' >Entrar
                    </SubmitButton>
                    <SimpleLink to='/forgot_password'>Esqueceu a senha?</SimpleLink>
                </Form>
            </Wrapper>
        </ThemeProvider>
    );
}

export default Login;


const Title = styled.h1`
    text-align: center;
    margin: .7rem auto 1.4rem;
    font-size: 2.2rem;
    font-weight: 200;
    color: ${props => props.theme.color.primary};
    font-weight: 300;

    span {
        color: ${props => props.theme.color.secondary};
        font-weight: 600;
    }
`










