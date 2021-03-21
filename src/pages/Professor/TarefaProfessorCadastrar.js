import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form'
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
import parse from 'date-fns/parse'


function TarefaProfessorCadastrar(props) {
    const [errorMessage, setErrorMessage] = useState();

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch, control } = useForm({ mode: 'onSubmit' });

    let idAdvisor = useRef();
    idAdvisor.current = localStorage.getItem('reg');

    const history = useHistory();
    const { projectId } = useParams();

    let breadcrumb = [
        { bread: 'Meus Projetos', link: '/professor/projetos' },
        { bread: 'Projeto', link: `/professor/projetos/${projectId}` },
        { bread: 'Tarefas', link: `/professor/projetos/${projectId}/tarefas` },
        { bread: 'Nova Tarefa', link: `` },
    ];

    const onSubmit = ({ title, description, initialDate, deadline }) => {
        initialDate = format(initialDate, 'dd/MM/yyyy');
        deadline = format(deadline, 'dd/MM/yyyy');
        console.log('DEADLINE', deadline)

        api.post('/tarefas/cadastrar_tarefas', {
            title,
            description,
            projectId: projectId,
            initialDate: initialDate,
            deadLine: deadline,
            userId: idAdvisor.current

        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Atividade cadastrada com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push(`/professor/projetos/${projectId}/atividades`)
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
        <DashboardUI screenName='Cadastrar Tarefa' itemActive="Meus Projetos" breadcrumb={breadcrumb}>

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
                    />
                </IconTextField>
                {errors.description &&
                    <ErrorMessage left marginTop marginBottom>
                        Uma descrição é obrigatória
                    </ErrorMessage>
                }


                <Label htmlFor='initialDate'>Data de início</Label>

                <Controller
                    control={control}
                    name="initialDate"
                    render={({ onChange, onBlur, value }) => (
                        <StyledDatePicker
                            value={value}
                            onChange={onChange}
                            locale='pt-BR'
                            timeIntervals={15}
                            name="initialDate"
                            error={errors.initialDate}
                            placeholder="Data de início..."
                            style={{ borderColor: errors.initialDate && light.color.secondary }}
                        />
                    )}
                    defaultValue=''
                    rules={{ required: true }}

                />



                {errors.initialDate &&
                    <ErrorMessage left marginTop marginBottom>
                        A data de inicío é obrigatória
                    </ErrorMessage>
                }


                <Label htmlFor='deadline'>Prazo de entrega</Label>
                <Controller
                    control={control}
                    name="deadline"
                    render={({ onChange, onBlur, value }) => (
                        <StyledDatePicker
                            value={value}
                            onChange={onChange}
                            locale='pt-BR'
                            timeIntervals={15}
                            name="deadline"
                            error={errors.deadline}
                            placeholder="Prazo de entrega..."
                            style={{ borderColor: errors.deadline && light.color.secondary }}
                            initialDate={new Date()}

                        />
                    )}
                    defaultValue=''
                    rules={{ required: true }}

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
                <Button new={true} type='button' width='100px' onClick={() => history.replace(`/professor/projetos/${projectId}/tarefas`)}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default TarefaProfessorCadastrar;