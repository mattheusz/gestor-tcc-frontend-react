import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import api from '../../api/api'
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Button from '../../components/Button'
import DashboardUI from '../../components/DashboardUI';
import { FaUserAlt, FaAddressCard, FaEnvelope } from 'react-icons/fa';

import IconTextField, { Input } from '../../components/IconTextField/IconTextField';
import Checkbox from '../../components/Checkbox';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';
import { UserRegistrationContext } from '../../context/UserRegistrationContext';
import Select from '../../components/Select';

function ProjetosEditar(props) {

    const { register, handleSubmit, errors } = useForm({ mode: 'onSubmit' });

    const history = useHistory()

    const { userRegistration } = useContext(UserRegistrationContext)
    const { registration, name, email, isCoordinator, status } = userRegistration;
    const [checked, setChecked] = useState(isCoordinator);
    console.log('checked? ', checked)

    const { userRegistration: { _id } } = useContext(UserRegistrationContext)
    console.log('ID', _id);

    let breadcrumb = [
        { bread: 'Projetos', link: '/projetos' },
        { bread: `Editar projeto ${name}`, link: '/projetos' },
    ];

    const handleCheckboxChange = event => {
        console.debug('Checkbox', event.target.checked)
        setChecked(event.target.checked)
    }

    const onSubmit = ({ fullName, email, registration, isCoordinator }) => {
        console.log('full name:', fullName)
        console.log('email', email)
        console.log('is coordinator', isCoordinator)
        api.patch('usuarios/todos_usuarios/atualizar_professor', {
            id: _id,
            name: fullName,
            email,
            registration,
            isCoordinator: isCoordinator,
            userType: 'professor',
            status
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Professor atualizado com sucesso", {
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
        <DashboardUI screenName='Editar Projeto' itemActive="Projetos" breadcrumb={breadcrumb}>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='advisor'>Alterar orientador</Label>
                <Select
                    formSelect={true}
                    value=''
                    ref={register}
                    onChange={e => { }}
                    name='studentOne'
                    id='studentOne'
                >
                    {


                    }
                </Select>

                <Button new={true} type='submit' width='100px'>
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

export default ProjetosEditar;