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
import Checkbox from '../../components/Checkbox';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';

function ProfessoresCadastrar(props) {
    const [checked, setChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [submitedWithSucess, setSubmitedWithSucess] = useState(false);

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch } = useForm({ mode: 'onSubmit' });
    const watchPassword = watch('password');

    const history = useHistory()

    let breadcrumb = [
        { bread: 'Professores', link: '/professores' },
        { bread: 'Cadastrar Professor', link: `` },
    ];

    const handleCheckboxChange = event => {
        console.debug('Checkbox', 'foi clicado')
        setChecked(event.target.checked)
    }

    const onSubmit = ({ fullName, email, registration, isCoordinator }) => {
        console.log('full name:', fullName)
        console.log('email', email)
        console.log('is coordinator', isCoordinator)
        api.post('usuarios/cadastrar_professor', {
            name: fullName,
            email,
            registration,
            isCoordinator,
            userType: 'professor',
            status: 'ativo',

        })
            .then(response => {
                console.log(response.data);
                setSubmitedWithSucess(true);
                const notify = () =>
                    toast.success("Professor cadastrado com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push('/professores')
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setErrorMessage(msg)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), 2000);
                });

            });
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1500);
        });
    }

    return (
        <DashboardUI screenName='Cadastrar Professor' itemActive="Professores" breadcrumb={breadcrumb}>

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
                {errorMessage &&
                    <ErrorMessage left style={{ marginTop: '4px', marginBottom: '7px' }}>
                        {errorMessage}
                    </ErrorMessage>
                }
                <Button new={true} type='submit' width='100px' disabled={isSubmitting || submitedWithSucess || false}>
                    Salvar
                </Button>
                <Button new={true} type='button' width='100px' onClick={() => history.replace('/professores')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default ProfessoresCadastrar;