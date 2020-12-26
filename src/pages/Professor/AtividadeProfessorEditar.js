import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
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


function AtividadeProfessorEditar(props) {
    const [errorMessage, setErrorMessage] = useState();
    const [startDate, setStartDate] = useState(new Date());
    console.debug('Data selecionada', startDate);
    console.debug('Data atual', new Date());

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch } = useForm({ mode: 'onSubmit' });
    const watchAddStudentTwo = watch('addStudendTwo');
    /*
    let id = useRef();
    id.current = localStorage.getItem('reg')
    */

    const history = useHistory();
    const { id, activity } = useParams();

    useEffect(() => {
        api.get(`usuarios/listar_usuarios/aluno_sem_projeto/1`)
            .then(response => {
                console.log(response)

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
    }, [])


    const onSubmit = ({ title, description, studentOne }) => {

        api.post('/projeto/cadastrar_projeto', {

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
                    history.push('/professor')
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

    return (
        <DashboardUI screenName='Editar Atividade' itemActive="Meus Projetos">

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

                <Label htmlFor='deadline'>Prazo de entrega</Label>
                <StyledDatePicker
                    startDate={startDate}
                    setStartDate={date => setStartDate(date)}
                    locale='pt-BR'
                    timeIntervals={15}
                />



                {errors.registration &&
                    <ErrorMessage left marginTop marginBottom>
                        A matrícula  é obrigatória
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
                <Button new={true} type='button' width='100px' onClick={() => history.replace(`/professor/projetos/${id}/atividades/${activity}`)}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default AtividadeProfessorEditar;