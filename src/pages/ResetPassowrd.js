import React, { useEffect, useRef, useState } from 'react';
import HeaderDefault from '../components/HeaderDefault';
import { Button, Form, Input, InputGroup, SubmitButton, SubTitle, Wrapper } from '../styled';
import { RiLockPasswordFill } from 'react-icons/ri'
import { ThemeProvider } from 'styled-components';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import lightTheme from '../themes/light'
import useInput from '../hooks/useInput';

function ResetPassowrd(props) {
    const [password, bindPassword] = useInput('')
    const [confirmPassword, bindConfirmPassword] = useInput('')

    const inputPasswordRef = useRef(null)

    useEffect(() => {
        inputPasswordRef.current.focus()
    }, [])

    const onFormSubmit = e => {
        e.preventDefault();
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <Wrapper>
                <HeaderDefault />
                <Form onSubmit={onFormSubmit}>
                    <SubTitle>Agora é a hora de voltar!</SubTitle>
                    <InputGroup>
                        <RiLockPasswordFill />
                        <Input type='password' placeholder='Nova Senha' ref={inputPasswordRef} {...bindPassword} />
                    </InputGroup>
                    <InputGroup>
                        <RiLockPasswordFill />
                        <Input type='password' placeholder='Confirmar Nova Senha' {...bindConfirmPassword} />
                    </InputGroup>
                    <SubmitButton>Resetar a senha</SubmitButton>
                </Form>
            </Wrapper>
        </ThemeProvider>

    );
}

export default ResetPassowrd;