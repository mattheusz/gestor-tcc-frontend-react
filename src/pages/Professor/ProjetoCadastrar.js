import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
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
import Select from '../../components/Select';

function ProjetoCadastrar(props) {
    const [checked, setChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [studentsWithoutProject, setStudentsWithoutProject] = useState();
    const [selectedStudentOne, setSelectedStudentOne] = useState('Aluno 1');
    const [selectedStudentTwo, setSelectedStudentTwo] = useState('');

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch } = useForm({ mode: 'onSubmit' });
    const watchAddStudentTwo = watch('addStudendTwo');

    let id = useRef();
    id.current = localStorage.getItem('reg')

    const history = useHistory()

    useEffect(() => {
        api.get(`usuarios/listar_usuarios/aluno_sem_projeto/1`)
            .then(response => {
                console.log(response)
                setStudentsWithoutProject(response.data.docs)
                setSelectedStudentOne(response.data.docs[0])
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    setSelectedStudentOne('-')
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, [])

    const handleCheckboxChange = event => {
        if (!event.target.checked)
            setSelectedStudentTwo('')
        setChecked(event.target.checked)
    }

    const onSubmit = ({ title, description, studentOne }) => {
        console.log('title:', title)
        console.log('description', description)
        console.log('id', studentOne)
        console.log(selectedStudentOne)
        if (selectedStudentOne == '-' || selectedStudentTwo == '-') {
            console.log('Deu ruim')
            setErrorMessage('Não há alunos disponíveis para orientação.');
            return;
        }

        if (selectedStudentOne === selectedStudentTwo) {
            setErrorMessage('Selecione alunos diferentes.');
        }


        api.post('/projeto/cadastrar_projeto', {
            title,
            description,
            studentOne: selectedStudentOne,
            studentTwo: selectedStudentTwo,
            advisor: id.current,
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Projeto cadastrado com sucesso", {
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
                    setErrorMessage('Erro ao inserir usuário. Tente novamente.')
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

    const onChangeSelectStudentOne = e => {
        setSelectedStudentOne(e.target.value)
    }

    const onChangeSelectStudentTwo = e => {
        setSelectedStudentTwo(e.target.value)
    }

    return (
        <DashboardUI screenName='Cadastrar Projeto' itemActive="Meus Projetos">

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
                        style={{ borderColor: errors.fullName && light.color.secondary }}
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
                <Label htmlFor='studentOne'>Aluno 1</Label>
                <Select
                    formSelect={true}
                    value={selectedStudentOne}
                    ref={register}
                    onChange={e => onChangeSelectStudentOne(e)}
                    name='studentOne'
                    id='studentOne'
                >
                    {
                        studentsWithoutProject ?
                            studentsWithoutProject.map(({ _id, name }) => {
                                console.log('student 1 id', _id);
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
                                Nenhum aluno disponível
                            </option>

                    }
                </Select>


                <Label style={{ fontSize: '1.1rem' }}>
                    <Checkbox
                        name='addStudendTwo'
                        checked={checked}
                        onChange={e => handleCheckboxChange(e)}
                        register={register}
                    />
                    <span style={{ marginLeft: 8, cursor: 'pointer' }}>Adicionar segundo aluno</span>
                </Label>
                <br />

                {watchAddStudentTwo &&
                    <>
                        <Label htmlFor='studentOne'>Aluno 2</Label>
                        <Select
                            formSelect={true}
                            value={selectedStudentTwo}
                            ref={register}
                            onChange={e => onChangeSelectStudentTwo(e)}
                            name='studentTwo'
                            id='studentTwo'
                        >
                            {
                                studentsWithoutProject ?
                                    studentsWithoutProject.map(({ _id, name }) => {
                                        console.log('student 1', selectedStudentOne);
                                        console.log('student 1', name);
                                        if (name === selectedStudentOne) return;
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
                                        Nenhum aluno disponível
                            </option>

                            }
                        </Select>
                    </>
                }

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
                <Button new={true} type='button' width='100px' onClick={() => history.replace('/professor')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default ProjetoCadastrar;