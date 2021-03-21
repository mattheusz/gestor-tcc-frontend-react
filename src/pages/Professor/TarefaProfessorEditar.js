import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import api from '../../api/api'
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Button from '../../components/Button'
import DashboardUI from '../../components/DashboardUI';
import { MdTitle } from 'react-icons/md';
import { BiDetail } from 'react-icons/bi';

import IconTextField, { Input } from '../../components/IconTextField/IconTextField';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';
import StyledDatePicker from '../../components/StyledDatePicker';
import format from 'date-fns/format'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import Select from '../../components/Select';
import { convertZonedTimeToUTC } from '../../utils/convertDate';
import { addHours } from 'date-fns';


function TarefaProfessorEditar(props) {
    const [errorMessage, setErrorMessage] = useState();

    const [task, setTask] = useState();
    const [initialDate, setInitialDate] = useState();
    const [deadline, setDeadline] = useState();
    const [situation, setSituation] = useState();

    const { register, handleSubmit, errors, formState: { isSubmitting }, setValue } = useForm({
        mode: 'onSubmit',

    });

    /*
    let id = useRef();
    id.current = localStorage.getItem('reg')
    */

    const selectOptionItems = [
        {
            value: 'iniciada',
            displayValue: 'Iniciada'
        },
        {
            value: 'recusada',
            displayValue: 'Recusada'
        },
        {
            value: 'concluída',
            displayValue: 'Concluída'
        }
    ];

    const history = useHistory();
    const { id, projectId, taskId } = useParams();

    let breadcrumb = [
        { bread: 'Meus Projetos', link: '/professor/projetos' },
        { bread: 'Projeto', link: `/professor/projetos/${projectId}` },
        { bread: 'Tarefas', link: `/professor/projetos/${projectId}/tarefas` },
        { bread: task && task.title, link: `/professor/projetos/${projectId}/tarefas/${taskId}` },
        { bread: 'Editar Tarefa', link: `` },
    ];

    useEffect(() => {
        api.get(`/tarefa/${taskId}/`)
            .then(({ data: { docs } }) => {
                console.log('Tarefas do projeto', docs[0]);
                // setting initial state, that the value to display in input date-picker
                setSituation(docs[0].situation);
                console.log(docs[0].deadLine)
                console.log(zonedTimeToUtc(new Date(docs[0].deadLine)))
                console.log(utcToZonedTime(new Date(docs[0].deadLine)))
                console.log((new Date(docs[0].deadLine)))

                setInitialDate(utcToZonedTime(new Date(docs[0].initialDate)));
                setDeadline(utcToZonedTime(new Date(docs[0].deadLine)));
                // setting initial date to custom register customRegisterInitialDate
                setValue('customRegisterInitialDate', new Date(docs[0].initialDate));
                setValue('customRegisterDeadline', utcToZonedTime(new Date(docs[0].deadLine)), { shouldValidate: true });
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

    const onSubmit = ({ title, description, customRegisterInitialDate, customRegisterDeadline, situation }) => {
        console.debug('ZONEDTIMETOUTC', format(zonedTimeToUtc(new Date(customRegisterDeadline)), 'dd/MM/yyyy hh:mm:ss', Intl.DateTimeFormat().resolvedOptions().timeZone))
        console.debug('ZONEDTIMETOUTC', format(new Date(customRegisterDeadline), 'dd/MM/yyyy hh:mm:ss'));
        api.patch(`/tarefas/atualizar_tarefa/professor/${taskId}`, {
            title,
            description,
            initialDate: convertZonedTimeToUTC(customRegisterInitialDate),
            deadLine: convertZonedTimeToUTC(customRegisterDeadline),
            situation
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
                    setErrorMessage('Erro ao editar tarefa. Tente novamente.')
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
        setValue('customRegisterInitialDate', e, { shouldValidate: true }); // setting value in the custom register
    }

    const onChangeSelectSituation = e => {
        setSituation(e.target.value)
    }

    const handleChangeDeadline = e => {
        console.log('e', e)
        setDeadline(e); // setting value in the state. necessary for update display of the input initialDate
        setValue('customRegisterDeadline', e, { shouldValidate: true }); // setting value in the custom register
    }

    return (
        <DashboardUI screenName='Editar Tarefa' itemActive="Meus Projetos" breadcrumb={breadcrumb}>

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

                <Label htmlFor='situation'>Situação</Label>
                <Select
                    formSelect={true}
                    value={situation}
                    ref={register}
                    onChange={e => onChangeSelectSituation(e)}
                    name='situation'
                    id='situation'
                >
                    {
                        selectOptionItems.map((item, index) => {
                            return (
                                <option
                                    key={index}
                                    value={item.value}
                                    style={{ width: '100%' }}
                                >
                                    {item.displayValue}
                                </option>)
                        })
                    }
                </Select>

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