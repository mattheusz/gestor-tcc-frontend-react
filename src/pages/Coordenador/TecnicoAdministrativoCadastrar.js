import React, { useState } from 'react';
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

function TecnicoAdministrativoCadastrar(props) {
    const [errorMessage, setErrorMessage] = useState();
    const { register, handleSubmit, errors, watch } = useForm({ mode: 'onSubmit' });

    const watchPassword = watch('password')

    const history = useHistory()

    const onSubmit = ({ fullName, email, registration, password, confirmPassword, }) => {
        api.post('usuarios/cadastrar_administrativo', {
            name: fullName,
            email,
            registration,
            password,
            confirmPassword,
            userType: 'administrativo',
            status: 'ativo'
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Técnico Administrativo cadastrado com sucesso", {
                        autoClose: 2000,
                    });
                notify()
                setTimeout(() => {
                    history.push('/coordenador/tecnicos_administrativos')
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
    }

    return (
        <DashboardUI screenName='Cadastrar Técnico Administrativo' itemActive="Técnicos Administrativos">

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
                            minLength: 8,
                            validate: (value) => value === watchPassword
                        })}
                        placeholder='Senha'
                        style={{ borderColor: errors.confirmPassword && light.color.secondary }}
                    />
                </IconTextField>
                {errors.confirmPassword && errors.confirmPassword.type === 'required' &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}> A confirmação senha deve preenchida</ErrorMessage>
                }
                {/*errors.confirmPassword && errors.confirmPassword.type === 'minLength' && <ErrorMessage left>A confirmação senha deve ter no mínimo 8 caracteres </ErrorMessage>*/}
                {errors.confirmPassword && errors.confirmPassword.type === 'validate' &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>As senhas digitadas não conferem </ErrorMessage>
                }


                {errorMessage &&
                    <ErrorMessage left style={{ marginTop: '4px', marginBottom: '7px' }}>
                        {errorMessage}
                    </ErrorMessage>
                }
                <Button new={true} type='submit' width='100px'>
                    Salvar
                </Button>
                &nbsp;
                <Button new={true} type='button' width='100px' onClick={() => history.replace('/coordenador/tecnicos_administrativos')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default TecnicoAdministrativoCadastrar;