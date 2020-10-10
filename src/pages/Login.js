import React, { useEffect, useRef, useState } from 'react';
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
            <Container>
                <BannerIFF />
                <CenterForm onSubmit={onFormSubmit} >
                    <Brand extraLarge>
                        Gestor de <span>TCC</span>
                    </Brand>
                    <IconTextField>
                        <FaAddressCard />
                        <Input
                            value={registration}
                            placeholder='Matrícula'
                            onChange={(e) => setRegistration(e.target.value)}
                            ref={inputMatriculaRef}
                            type='text'
                        />
                    </IconTextField>


                    <IconTextField>
                        <FaLock />
                        <Input
                            value={senha}
                            placeholder='Senha'
                            onChange={(e) => setSenha(e.target.value)}
                            type='password'
                        />
                    </IconTextField>

                    <Button type='submit' >Entrar
                    </Button>
                    <SimpleLink to='/forgot_password'>Esqueceu a senha?</SimpleLink>
                </CenterForm>
            </Container>
        </ThemeProvider>
    );
}

export default Login;



