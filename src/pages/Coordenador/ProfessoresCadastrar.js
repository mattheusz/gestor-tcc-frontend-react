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
import Checkbox from '../../components/Checkbox';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';

function ProfessoresCadastrar(props) {
    const [searchText, setSearchText] = useState('');
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [checked, setChecked] = useState(false);
    const { register, handleSubmit, errors, formState } = useForm({ mode: 'onSubmit' });

    const history = useHistory()

    const isInitialMount = useRef(true);


    const onChangeSelect = e => {
        setSelectedValue(e.target.value)

    }

    const handleCheckboxChange = event => {
        console.debug('Checkbox', 'foi clicado')
        setChecked(event.target.checked)
    }

    const onSubmit = ({ fullName, email, registration, password, confirmPassword, isCoordinator }) => {
        api.post('usuarios/cadastrar_professor', {
            name: fullName,
            email,
            registration,
            password,
            confirmPassword,
            isCoordinator,
            userType: 'professor',
            status: 'ativo'
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Professor cadastrado com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push('/coordenador/professores')
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
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
        <DashboardUI screenName='Cadastrar Professor' itemActive="Professores">

            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='fullName'>Nome completo</Label>
                <IconTextField>
                    <FaUserAlt />
                    <Input
                        id='fullName'
                        name='fullName'
                        ref={register({
                            required: 'true'
                        })}
                        placeholder='Nome Completo'
                        style={{ borderColor: errors.fullName && light.color.secondary }}
                    />
                </IconTextField>
                {errors.fullName &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>
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
                            required: 'true'
                        })}
                        placeholder='E-mail'
                        style={{ borderColor: errors.email && light.color.secondary }}
                    />
                </IconTextField>
                {errors.email &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>
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
                            required: 'true'
                        })}
                        placeholder='Matrícula'
                        style={{ borderColor: errors.registration && light.color.secondary }}
                    />
                </IconTextField>
                {errors.registration &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>
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
                            required: 'true',
                            minLength: 8
                        })}
                        placeholder='Senha'
                        style={{ borderColor: errors.password && light.color.secondary }}
                    />
                </IconTextField>
                {errors.password &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>
                        A senha completo é obrigatória.
                    </ErrorMessage>
                }

                <Label htmlFor='confirmPassword'>Confirmar Senha</Label>
                <IconTextField>
                    <FaLock />
                    <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        ref={register({
                            required: 'true',
                            minLength: 8
                        })}
                        placeholder='Senha'
                        style={{ borderColor: errors.confirmPassword && light.color.secondary }}
                    />
                </IconTextField>
                {errors.password &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>
                        A senha completo é obrigatória.
                    </ErrorMessage>
                }

                <Label style={{ fontSize: '1.1rem' }}>
                    <Checkbox
                        name='isCoordinator'
                        checked={checked}
                        onChange={e => handleCheckboxChange(e)}
                        register={register}
                    />
                    <span style={{ marginLeft: 8, cursor: 'pointer' }}>Coordenador</span>
                </Label>
                <br />
                <Button new={true} type='submit' width='100px'>
                    Salvar
                </Button>
                &nbsp;
                <Button new={true} type='button' width='100px' onClick={() => history.replace('/coordenador/professores')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default ProfessoresCadastrar;