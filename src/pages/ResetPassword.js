import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
import ErrorMessage from '../components/Error/ErrorMessage';
import { AuthContext } from '../context/AuthContext';

function ResetPassword(props) {

    const { register, handleSubmit, erros, watch } = useForm();

    const watchPassword = watch('password')

    const { handleResetPassword, errorMessage, setErrorMessage } = useContext(AuthContext);

    const { token } = useParams();

    const onSubmit = ({ password, confirmPassword }) => {
        handleResetPassword(password, confirmPassword, token);
        console.log(password, confirmPassword, token);
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <Container>
                <BannerIFF />
                <CenterForm onSubmit={handleSubmit(onSubmit)}>
                    <ResetIcon />
                    <Heading2>Agora é a hora de voltar!</Heading2>
                    <IconTextField>
                        <RiLockPasswordFill />
                        <Input
                            name='password'
                            type='password'
                            placeholder='Nova Senha'
                            ref={register({
                                required: true,
                                minLength: 8,
                            })}
                        />
                    </IconTextField>
                    {erros.password && erros.password.type === 'required' && <ErrorMessage left>A senha deve preenchida</ErrorMessage>}
                    {erros.password && erros.password.type === 'minLength' && <ErrorMessage left>A senha deve ter no mínimo 8 caracteres </ErrorMessage>}
                    <InputGroup>
                        <RiLockPasswordFill />
                        <Input
                            name='confirmPassword'
                            type='password'
                            placeholder='Confirmar Nova Senha'
                            ref={register({
                                required: true,
                                minLength: 8,
                                validate: (value) => value === watch('password')
                            })}

                        />
                    </InputGroup>
                    {erros.password && erros.password.type === 'required' && <ErrorMessage left>A confirmação senha deve preenchida</ErrorMessage>}
                    {erros.password && erros.password.type === 'minLength' && <ErrorMessage left>A confirmação senha deve ter no mínimo 8 caracteres </ErrorMessage>}
                    {erros.password && erros.password.type === 'minLength' && <ErrorMessage left>As senhas digitadas não conferem </ErrorMessage>}

                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
