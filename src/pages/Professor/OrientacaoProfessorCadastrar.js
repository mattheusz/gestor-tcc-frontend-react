import React, { useEffect, useRef, useState } from 'react';
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
import Select from '../../components/Select';
import format from 'date-fns/format'

function OrientacaoProfessorCadastrar(props) {
    const [errorMessage, setErrorMessage] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [orientationType, setOrientationType] = useState('');
    const [orientationDate, setOrientationDate] = useState();
    console.debug('Data selecionada', startDate);
    console.debug('Data atual', new Date());

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch, setValue } = useForm({ mode: 'onSubmit' });

    /*
    let id = useRef();
    id.current = localStorage.getItem('reg')
    */

    const history = useHistory()
    const { projectId } = useParams();

    const onSubmit = ({ title, description, customRegisterOrientationDate }) => {

        format(customRegisterOrientationDate, 'dd/MM/yyyy');

        api.post(`/orientacao/cadastrar_orientacao`, {
            title,
            description,
            projectId,
            dateOrientation: format(customRegisterOrientationDate, 'dd/MM/yyyy'),
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Orientação registrada com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push(`/professor/projetos/${projectId}/orientacoes`)
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setErrorMessage('Erro ao registrar a orientação. Tente novamente.')
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
        register('customRegisterOrientationDate', { required: true })
    }, [register]);

    const handleChangeOrientationDate = date => {
        console.log('e', date)
        setValue('customRegisterOrientationDate', date, { shouldValidate: true }); // setting value in the custom register
        setOrientationDate(date); // setting value in the state. necessary for update display of the input initialDate
    }

    return (
        <DashboardUI screenName='Registrar Orientação' itemActive="Meus Projetos">

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

                <Label htmlFor='orientationDate'>Data da orientação</Label>
                <StyledDatePicker
                    value={orientationDate}
                    onChange={value => handleChangeOrientationDate(value)}
                    locale='pt-BR'
                    timeIntervals={15}
                    name="orientationDate"
                    error={errors.customRegisterOrientationDate}
                    placeholder="Data da orientação.."
                    style={{ borderColor: errors.customRegisterOrientationDate && light.color.secondary }}
                />

                {errors.customRegisterOrientationDate &&
                    <ErrorMessage left marginTop marginBottom>
                        A data da orientação é obrigatória
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
                <Button new={true} type='button' width='100px' onClick={() => history.replace(`/professor/projetos/${projectId}/orientacoes`)}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default OrientacaoProfessorCadastrar;