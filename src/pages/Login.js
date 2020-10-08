import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'styled-components'
import lightTheme from '../themes/light'
import { FaAddressCard, FaLock } from "react-icons/fa";
import HeaderDefault from '../components/HeaderDefault';
import { Wrapper, Form, InputGroup, Input, SimpleLink, SubmitButton, Logo } from '../styled';


function Login(props) {
    const [registration, setRegistration] = useState('');
    const [senha, setSenha] = useState('');

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

                    <Logo>
                        Gestor de <span>TCC</span>
                    </Logo>
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



