import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import api from '../../api/api'
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Button from '../../components/Button'
import DashboardUI from '../../components/DashboardUI';
import { FaUserAlt, FaAddressCard, FaEnvelope, FaLock } from 'react-icons/fa';

import IconTextField, { Input } from '../../components/IconTextField/IconTextField';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';

function AlunoCadastrar(props) {
    const [errorMessage, setErrorMessage] = useState();

    let loading = useRef();

    useEffect(() => {

    })

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch } = useForm({ mode: 'onSubmit' });
    const watchPassword = watch('password');

    const history = useHistory()
    loading.current = isSubmitting;
    console.log('issubmitting padrão', isSubmitting)

    const onSubmit = ({ fullName, email, registration, password, confirmPassword, }) => {
        console.log('isSubmitting:', isSubmitting)
        api.post('usuarios/cadastrar_aluno', {
            name: fullName,
            email,
            registration,
            password,
            confirmPassword,
            userType: 'aluno',
            available: 'sim',
            status: 'ativo'
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Aluno cadastrado com sucesso", {
                        autoClose: 2000,
                    });
                notify()
                setTimeout(() => {
                    history.push('/alunos')
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });

        return new Promise((resolve) => {
            setTimeout(() => resolve(), 3000);
        });
    }

    return (
        <DashboardUI screenName='Cadastrar Aluno' itemActive="Alunos">

            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='fullName'>Nome completo</Label>
                <IconTextField>
                    <FaUserAlt />
                    <Input
                        id='fullName'
                        name='fullName'
                        ref={register({
                            required: true
                        })}
                        placeholder='Nome Completo'
                        autoFocus
                        style={{ borderColor: errors.fullName && light.color.secondary }}
                    />
                </IconTextField>
                {errors.fullName &&
                    <ErrorMessage left marginTop marginBottom>
                        O nome completo é obrigatório
                    </ErrorMessage>
                }

                <Label htmlFor='email'>E-mail</Label>
                <IconTextField>
                    <FaEnvelope />
                    <Input
                        id='email'
                        name='email'
                        type='email'
                        ref={register({
                            required: true
                        })}
                        placeholder='E-mail'
                        style={{ borderColor: errors.email && light.color.secondary }}
                    />
                </IconTextField>
                {errors.email &&
                    <ErrorMessage left marginTop marginBottom>
                        O e-mail é obrigatório
                    </ErrorMessage>
                }

                <Label htmlFor='registration'>Matrícula</Label>
                <IconTextField>
                    <FaAddressCard />
                    <Input
                        id='registration'
                        name='registration'
                        ref={register({
                            required: true
                        })}
                        placeholder='Matrícula'
                        style={{ borderColor: errors.registration && light.color.secondary }}
                    />
                </IconTextField>
                {errors.registration &&
                    <ErrorMessage left marginTop marginBottom>
                        A matrícula  é obrigatória
                    </ErrorMessage>
                }

                <Label htmlFor='password'>Senha</Label>
                <IconTextField>
                    <FaLock />
                    <Input
                        id='password'
                        name='password'
                        ref={register({
                            required: true,
                            minLength: 8
                        })}
                        placeholder='Senha'
                        style={{ borderColor: errors.password && light.color.secondary }}
                    />
                </IconTextField>
                {errors.password && errors.password.type === 'required' &&
                    <ErrorMessage left marginTop marginBottom>
                        A senha é obrigatória.
                    </ErrorMessage>
                }
                {errors.password && errors.password.type === 'minLength' &&
                    <ErrorMessage left marginTop marginBottom>A senha deve ter no mínimo 8 caracteres </ErrorMessage>
                }

                <Label htmlFor='confirmPassword'>Confirmar Senha</Label>
                <IconTextField>
                    <FaLock />
                    <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        ref={register({
                            required: true,
                            validate: (value) => value === watchPassword
                        })}
                        placeholder='Senha'
                        style={{ borderColor: errors.confirmPassword && light.color.secondary }}
                    />
                </IconTextField>
                {errors.confirmPassword && errors.confirmPassword.type === 'required' &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}> A confirmação senha deve preenchida</ErrorMessage>
                }

                {errors.confirmPassword && errors.confirmPassword.type === 'validate' &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>As senhas digitadas não conferem </ErrorMessage>
                }


                {errorMessage &&
                    <ErrorMessage left style={{ marginTop: '4px', marginBottom: '7px' }}>
                        {errorMessage}
                    </ErrorMessage>
                }
                {console.log('loading: ', loading.current)}
                <Button new={true} type='submit' width='100px' disabled={isSubmitting}>
                    Salvar
                </Button>
                &nbsp;
                <Button new={true} type='button' width='100px' onClick={() => history.replace('/alunos')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default AlunoCadastrar;