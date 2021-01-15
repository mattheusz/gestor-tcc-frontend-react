import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import api from '../../api/api'
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Button from '../../components/Button'
import DashboardUI from '../../components/DashboardUI';
import { FaUserAlt, FaGraduationCap, FaEnvelope, FaLock } from 'react-icons/fa';
import { MdTitle } from 'react-icons/md';
import { BiDetail } from 'react-icons/bi';

import IconTextField, { Input } from '../../components/IconTextField/IconTextField';
import Checkbox from '../../components/Checkbox';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';
import StyledDatePicker from '../../components/StyledDatePicker';
import format from 'date-fns/format'


function TarefaProfessorEditar(props) {
    const [errorMessage, setErrorMessage] = useState();

    const [task, setTask] = useState();
    const [initialDate, setInitialDate] = useState();
    const [deadline, setDeadline] = useState();

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch, control, setValue, getValues } = useForm({
        mode: 'onSubmit',

    });

    /*
    let id = useRef();
    id.current = localStorage.getItem('reg')
    */

    const history = useHistory();
    const { id, taskId } = useParams();

    useEffect(() => {
        api.get(`/tarefa/${taskId}/`)
            .then(({ data: { docs } }) => {
                console.log('Tarefas do projeto', docs[0]);
                // setting initial state, that the value to display in input date-picker
                setInitialDate(new Date(docs[0].initialDate))
                setDeadline(new Date(docs[0].deadLine))
                // setting initial date to custom register customRegisterInitialDate
                setValue('customRegisterInitialDate', new Date(docs[0].initialDate))
                setValue('customRegisterDeadline', new Date(docs[0].deadLine))
                setTask(docs[0]);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    const onSubmit = ({ title, description, customRegisterInitialDate, customRegisterDeadline }) => {

        format(customRegisterInitialDate, 'dd/MM/yyyy');
        console.debug('initial date:', format(customRegisterInitialDate, 'dd/MM/yyyy'))
        format(customRegisterDeadline, 'dd/MM/yyyy');

        api.patch(`/tarefas/atualizar_tarefa/professor/${taskId}`, {
            title,
            description,
            initialDate: format(customRegisterInitialDate, 'dd/MM/yyyy'),
            deadLine: format(customRegisterDeadline, 'dd/MM/yyyy'),
            situation: 'iniciado'
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Tarefa atualizada com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push(`/professor/projetos/${id}/tarefas/${taskId}`)
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setErrorMessage('Erro ao cadastrar a atividade. Tente novamente.')
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

    useEffect(() => {
        // creating custom registers
        register('customRegisterInitialDate', { required: true })
        register('customRegisterDeadline', { required: true })
    }, [register]);

    const handleChangeInitialDate = e => {
        console.log('e', e)
        setInitialDate(e); // setting value in the state. necessary for update display of the input initialDate
        setValue('customRegisterInitialDate', e); // setting value in the custom register
    }

    const handleChangeDeadline = e => {
        console.log('e', e)
        setDeadline(e); // setting value in the state. necessary for update display of the input initialDate
        setValue('customRegisterDeadline', e); // setting value in the custom register
    }

    return (
        <DashboardUI screenName='Editar Tarefa' itemActive="Meus Projetos">

            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='title'>Título</Label>
                <IconTextField>
                    <MdTitle />
                    <Input
                        id='title'
                        name='title'
                        ref={register({
                            required: true
                        })}
                        placeholder='Título'
                        autoFocus
                        style={{ borderColor: errors.title && light.color.secondary }}
                        defaultValue={task && task.title}

                    />
                </IconTextField>
                {errors.title &&
                    <ErrorMessage left marginTop marginBottom>
                        O título é obrigatório
                    </ErrorMessage>
                }

                <Label htmlFor='description'>Descrição</Label>
                <IconTextField>
                    <BiDetail />
                    <Input
                        id='description'
                        name='description'
                        type='text'
                        ref={register({
                            required: true
                        })}
                        placeholder='Descrição'
                        style={{ borderColor: errors.description && light.color.secondary }}
                        defaultValue={task && task.description}
                    />
                </IconTextField>
                {errors.description &&
                    <ErrorMessage left marginTop marginBottom>
                        Uma descrição é obrigatória
                    </ErrorMessage>
                }

                <Label htmlFor='initialDate'>Data de início</Label>

                <StyledDatePicker
                    value={initialDate}
                    onChange={value => handleChangeInitialDate(value)}
                    locale='pt-BR'
                    timeIntervals={15}
                    name="initialDate"
                    error={errors.customRegisterInitialDate}
                    placeholder="Data de início..."
                    style={{ borderColor: errors.customRegisterInitialDate && light.color.secondary }}
                />



                {errors.customRegisterInitialDate &&
                    <ErrorMessage left marginTop marginBottom>
                        A data de inicío é obrigatória
                    </ErrorMessage>
                }


                <input type='date' ref={register} name='datas' defaultValue='2021-02-02'
                    style={{ padding: '7px', marginBottom: '7px' }}
                ></input>

                <Label htmlFor='deadline'>Prazo de entrega</Label>
                <StyledDatePicker
                    value={deadline}
                    onChange={value => handleChangeDeadline(value)}
                    locale='pt-BR'
                    timeIntervals={15}
                    name="deadline"
                    error={errors.deadline}
                    placeholder="Prazo de entrega..."
                    style={{ borderColor: errors.deadline && light.color.secondary }}
                />



                {errors.deadline &&
                    <ErrorMessage left marginTop marginBottom>
                        O prazo de entrega é obrigatório
                    </ErrorMessage>
                }

                {errorMessage &&
                    <ErrorMessage left style={{ marginTop: '4px', marginBottom: '7px' }}>
                        {errorMessage}
                    </ErrorMessage>
                }
                <Button new={true} type='submit' width='100px' disabled={isSubmitting}>
                    Salvar
                </Button>
                <Button new={true} type='button' width='100px' onClick={() => history.replace(`/professor/projetos/${id}/tarefas/${taskId}`)}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default TarefaProfessorEditar;