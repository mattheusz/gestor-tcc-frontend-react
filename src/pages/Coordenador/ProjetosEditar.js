import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
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

    const [availableProfessors, setAvailableProfessors] = useState();
    const [currentAdvisor, setCurrentAdvisor] = useState();

    const { register, handleSubmit, errors } = useForm({ mode: 'onSubmit' });

    const history = useHistory()
    const { projectId } = useParams();

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

    useEffect(() => {
        api.get(`usuarios/professores_sempaginacao`)
            .then(response => {
                console.log(response)
                setAvailableProfessors(response.data);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    setAvailableProfessors('-');
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    useEffect(() => {
        api.get(`/projeto/${projectId}`)
            .then(response => {
                console.log('current advisor', response);
                setCurrentAdvisor(response.data.docs[0].advisor);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    setCurrentAdvisor('-')
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    const handleCheckboxChange = event => {
        console.debug('Checkbox', event.target.checked)
        setChecked(event.target.checked)
    }

    const onSubmit = ({ advisor }) => {
        console.log('advisor:', advisor);
        api.patch(`/projeto/coordenacao/atualizar/${projectId}`, {
            advisor,
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
                    history.push('/projetos');
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

    const onChangeAdvisor = e => {
        setCurrentAdvisor(e.target.value)
    }

    return (
        <DashboardUI screenName='Editar Projeto' itemActive="Projetos" breadcrumb={breadcrumb}>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='advisor'>Alterar orientador</Label>
                <Select
                    formSelect={true}
                    defaultValue={currentAdvisor && currentAdvisor.name}
                    ref={register}
                    onChange={e => { onChangeAdvisor(e) }}
                    name='advisor'
                    id='advisor'
                >
                    <option
                        key={currentAdvisor && currentAdvisor._id}
                        value={currentAdvisor && currentAdvisor._id}
                        style={{ width: '100%' }}
                    >
                        {currentAdvisor && currentAdvisor.name}
                    </option>
                    {
                        availableProfessors ?
                            availableProfessors.map(({ _id, name }) => {
                                if (name === (currentAdvisor && currentAdvisor.name)) return;
                                console.log('professor id 1 id + name', _id, name);
                                return (<option
                                    key={_id}
                                    value={_id}
                                    style={{ width: '100%' }}
                                >
                                    {name}
                                </option>);
                            }) :
                            <option
                                key={1}
                                value={1}
                                style={{ width: '100%' }}
                            >
                                Nenhum professor disponível
                            </option>
                    }
                </Select>

                <Button new={true} type='submit' width='100px'>
                    Salvar
                </Button>
                <Button new={true} type='button' width='100px' onClick={() => history.replace('/projetos')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default ProjetosEditar;