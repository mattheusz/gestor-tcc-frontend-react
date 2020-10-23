import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, SubmitButton, Heading2, Wrapper } from '../styled';
import { RiLockPasswordFill } from 'react-icons/ri'
import styled, { ThemeProvider } from 'styled-components';
import lightTheme from '../themes/light'
import useInput from '../hooks/useInput';
import BannerIFF from '../components/BannerIFF';
import Container from '../components/Container';
import IconTextField, { Input } from '../components/IconTextField';
import Button from '../components/Button';
import CenterForm from '../components/CenterForm';
import { FiKey } from 'react-icons/fi'

function ResetPassword(props) {
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
            <Container>
                <BannerIFF />
                <CenterForm onSubmit={onFormSubmit}>
                    <ResetIcon />
                    <Heading2>Agora é a hora de voltar!</Heading2>
                    <IconTextField>
                        <RiLockPasswordFill />
                        <Input type='password' placeholder='Nova Senha' ref={inputPasswordRef} value={password} {...bindPassword} />
                    </IconTextField>
                    <InputGroup>
                        <RiLockPasswordFill />
                        <Input type='password' placeholder='Confirmar Nova Senha' value={confirmPassword} {...bindConfirmPassword} />
                    </InputGroup>
                    <Button>Resetar a senha</Button>
                </CenterForm>
            </Container>
        </ThemeProvider>

    );
}

export default ResetPassword;

const ResetIcon = styled(FiKey)`
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
