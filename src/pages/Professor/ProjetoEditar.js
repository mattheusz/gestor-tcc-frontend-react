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
import Checkbox from '../../components/Checkbox';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';
import Select from '../../components/Select';

function ProjetoEditar(props) {
    const [checkedChangeStudents, setCheckedChangeStudents] = useState(false);
    const [checkedAddStudentTwo, setCheckedAddStudentTwo] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [studentsWithoutProject, setStudentsWithoutProject] = useState();
    const [selectedStudentOne, setSelectedStudentOne] = useState('Aluno 1');
    const [selectedStudentTwo, setSelectedStudentTwo] = useState('');
    const [project, setProject] = useState();

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch } = useForm({ mode: 'onSubmit' });
    const watchChangeStudents = watch('changeStudents');
    const watchAddStudentTwo = watch('addStudendTwo');

    let idAdvisor = useRef();
    idAdvisor.current = localStorage.getItem('reg')

    const history = useHistory()
    const { id } = useParams();

    useEffect(() => {
        api.get(`/projeto/${id}`)
            .then(response => {
                console.log(response)
                setProject(response.data.docs[0])
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

    const handleCheckboxChangeStudents = event => {
        setCheckedChangeStudents(event.target.checked)
    }

    const handleCheckboxAddStudentTwo = event => {
        if (!event.target.checked)
            setSelectedStudentTwo('')
        setCheckedAddStudentTwo(event.target.checked)
    }

    const onSubmit = ({ title, description, studentOne, studentTwo }) => {
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
        console.log('student 1 submit:', studentOne)
        if (!studentOne)
            studentOne = project.students[0]._id;
        if (!studentTwo)
            studentTwo = project.students[1] ? project.students[1]._id : '';


        if (watchChangeStudents && !watchAddStudentTwo)
            studentTwo = '';


        console.log(project.students[0]._id)

        api.patch(`/projeto/atualizar_projeto/${id}`, {
            title,
            description,
            studentOne: studentOne,
            studentTwo: studentTwo,
            advisor: idAdvisor.current,
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
                    console.log('erro', msg);
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
        <DashboardUI screenName='Editar Projeto' itemActive="Meus Projetos">

            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='title'>Título</Label>
                <IconTextField>
                    <MdTitle />
                    <Input
                        id='title'
                        name='title'
                        defaultValue={project && project.title}
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
                        defaultValue={project && project.description}
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

                <Label style={{ fontSize: '1.1rem' }}>
                    <Checkbox
                        name='changeStudents'
                        checked={checkedChangeStudents}
                        onChange={e => handleCheckboxChangeStudents(e)}
                        register={register}
                    />
                    <span style={{ marginLeft: 8, cursor: 'pointer' }}>Alterar aluno(s)</span>
                </Label>

                <br />



                {watchChangeStudents &&

                    <>
                        <Label htmlFor='studentOne'>Aluno 1</Label>
                        <Select
                            formSelect={true}
                            defaultValue={project.students[0] && project.students[0].name}
                            ref={register}
                            onChange={e => onChangeSelectStudentOne(e)}
                            name='studentOne'
                            id='studentOne'
                        >
                            <option
                                key={project.students[0] && project.students[0]._id}
                                value={project.students[0] && project.students[0]._id}
                                style={{ width: '100%' }}
                            >
                                {project.students[0] && project.students[0].name}
                            </option>
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
                                checked={checkedAddStudentTwo}
                                onChange={e => handleCheckboxAddStudentTwo(e)}
                                register={register}
                            />
                            <span style={{ marginLeft: 8, cursor: 'pointer' }}>Adicionar segundo aluno</span>
                        </Label>
                        <br />

                        {watchAddStudentTwo &&
                            <>

                                <Label htmlFor='studentTwo'>Aluno 2</Label>
                                <Select
                                    formSelect={true}
                                    value={selectedStudentTwo}
                                    ref={register}
                                    onChange={e => onChangeSelectStudentTwo(e)}
                                    name='studentTwo'
                                    id='studentTwo'
                                >
                                    <option
                                        key={project.students[1] && project.students[1]._id}
                                        value={project.students[1] && project.students[1]._id}
                                        style={{ width: '100%' }}
                                    >
                                        {project.students[1] && project.students[1].name}
                                    </option>
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
                <Button new={true} type='button' width='100px' onClick={() => history.replace(`/professor/projetos/${id}`)}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </DashboardUI>
    );
}

export default ProjetoEditar;