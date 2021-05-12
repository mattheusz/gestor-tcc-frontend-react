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
import Select from '../../components/Select';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { convertUTCToZonedTime, convertZonedTimeToUTC } from '../../utils/convertDate';
import { format } from 'date-fns';


function OrientacaoProfessorEditar(props) {
    const [errorMessage, setErrorMessage] = useState();
    const [orientation, setOrientation] = useState();
    const [orientationType, setOrientationType] = useState('');
    const [orientationDate, setOrientationDate] = useState('');

    const {
        register,
        handleSubmit,
        errors,
        formState: { isSubmitting },
        watch,
        setValue,
    } = useForm({ mode: 'onSubmit' });

    const history = useHistory()
    const { orientationId, projectId } = useParams();

    let breadcrumb = [
        { bread: 'Meus Projetos', link: '/professor/projetos' },
        { bread: 'Projeto', link: `/professor/projetos/${projectId}` },
        { bread: 'Orientações', link: `/professor/projetos/${projectId}/orientacoes` },
        { bread: orientation && orientation.title, link: `/professor/projetos/${projectId}/orientacoes/${orientationId}` },
        { bread: 'Editar Orientação', link: `` },
    ];

    useEffect(() => {
        api.get(`/orientacao/${orientationId}`)
            .then(({ data: { docs } }) => {
                console.log('Orientação o', docs[0]);
                // setting orientationDate state, that the value to display in input date-picker
                setOrientationType(docs[0].type);
                setOrientationDate(utcToZonedTime(new Date(docs[0].dateOrientation)));
                // setting initial date to custom register customRegisterOrientationDate
                setValue('customRegisterOrientationDate', utcToZonedTime((new Date(docs[0].dateOrientation))), { shouldValidate: true });
                setOrientation(docs[0]);
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

    const onSubmit = ({ title, description, customRegisterOrientationDate }) => {
        console.debug('ORIENTATION DATE', format(customRegisterOrientationDate, 'dd/MM/yyyy'));
        api.patch(`/orientacao/atualizar_orientacao/${orientationId}`, {
            title,
            description,
            dateOrientation: convertZonedTimeToUTC(customRegisterOrientationDate),
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Orientação atualizada com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push(`/professor/projetos/${projectId}/orientacoes/${orientationId}`)
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setErrorMessage('Erro ao atualizar a orientação. Tente novamente.')
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
        <DashboardUI screenName='Editar Orientação' itemActive="Meus Projetos" breadcrumb={breadcrumb}>

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
                        defaultValue={orientation && orientation.title}
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
                        defaultValue={orientation && orientation.description}
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
                <Button new={true} type='button' width='100px' onClick={() => history.replace(`/professor/projetos/${projectId}/orientacoes/${orientationId}`)}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default OrientacaoProfessorEditar;