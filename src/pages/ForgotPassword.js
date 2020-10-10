import React, { useEffect, useRef } from 'react';
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
            <Container>
                <BannerIFF />
                <CenterForm onSubmit={onFormSubmit}>
                    <ForgotIcon />
                    <Heading2>Problemas para entrar?</Heading2>
                    <Paragraph>
                        Insira o seu e-mail e enviaremos um link para você voltar a acessar a sua conta.
                    </Paragraph>
                    <IconTextField>
                        <FaEnvelope />
                        <Input type='email' placeholder='E-mail' value={email} {...bindEmail} ref={inputEmailRef} />
                    </IconTextField>
                    <Button>Enviar link para login</Button>
                    <SimpleLink to='/login'>Voltar para o Login</SimpleLink>
                </CenterForm>
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
