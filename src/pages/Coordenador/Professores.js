import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import Switch from 'react-input-switch';
import Modal from 'react-modal';
import { AiOutlineEdit } from 'react-icons/ai';
import { UserRegistrationContext } from '../../context/UserRegistrationContext';
import Button from '../../components/Button';
import Paginator from '../../components/Paginator/Paginator';
import usePaginatorNumbers from '../../hooks/usePaginator';

function Professores(props) {
    const [searchText, setSearchText] = useState('');
    const [user, setUser] = useState([]);

    const [noUserFound, setNoUserFound] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);

    const isInitialMount = useRef(true);

    let professorName = useRef('');
    let professorId = useRef('');
    let professorStatus = useRef('')

    let modalMessage = useRef('')

    let totalPages = useRef();
    let currentPage = useRef()
    let paginationNumbers = useRef([]);
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers()

    console.debug('componente renderizado')

    const { setUserRegistration } = useContext(UserRegistrationContext);

    const selectItems = [
        {
            value: 'ativo',
            displayValue: 'Ativo'
        },
        {
            value: 'inativo',
            displayValue: 'Inativo'
        },
        {
            value: 'todos',
            displayValue: 'Todos'
        }
    ];

    Modal.setAppElement('#root');

    const history = useHistory();

    // carregando todos os professores ao montar componente
    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);
        api.get('usuarios/todos_usuarios/professor/ativo/1')
            .then(({ data }) => {
                currentPage.current = data.page;
                totalPages.current = data.totalPages;
                noUserFound && setNoUserFound(false);
                setUser(data.docs);
                buildPaginatorDesign();
            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setNoUserFound(true)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    // filtrando professor por todos, ativo e inativo
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [statusProfessorChanged, setStatusProfessorChanged] = useState(false);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;

            if (searchText === '') {
                path = `usuarios/todos_usuarios/professor/${selectedValue}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/todos_usuarios/professor/1`
            }
            else {
                path = `usuarios/listar_usuarios/professor/${selectedValue}/${searchText}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/listar_usuarios/professor/${searchText}/1`
            }

            api.get(path)
                .then(({ data }) => {
                    totalPages.current = data.totalPages;
                    setNoUserFound(false)
                    setUser(data.docs)
                    currentPage.current = data.page;
                    buildPaginatorDesign();
                })
                .catch(error => {
                    if (error.response) {
                        setNoUserFound(true)
                    }
                    if (error.request) {
                        console.log(error.request);
                    }
                    else {
                        console.log('Error', error.message);
                    }
                });
        }
    }, [selectedValue, statusProfessorChanged, formIsSubmitted])

    const onSubmit = e => {
        setMountedPagination(false);
        e.preventDefault();
        setFormIsSubmitted(!formIsSubmitted);
    }

    const onChangeSelect = e => {
        setMountedPagination(false)
        console.debug('mounted pagination: ', mountedPagination)
        setSelectedValue(e.target.value)
    }

    const addProfessor = () => {
        history.push('/professores/novo');
    }

    const editProfessor = (_id, registration, name, email, status, isCoordinator) => {
        setUserRegistration({ _id, registration, name, email, status, isCoordinator })
        history.push(`/professores/editar/${_id}`);
    }

    const activeAndInactive = (id, name, status) => {
        setMountedPagination(false);
        professorId.current = id;
        professorName.current = name;
        professorStatus.current = status;

        if (status === 'ativo')
            modalMessage.current = `Deseja desativar o professor ${professorName.current}?`
        else
            modalMessage.current = `Deseja ativar o professor ${professorName.current}?`

        setModalIsOpen(true)
    }

    const changeStatusProfessor = () => {

        api.put('usuarios/atualizar_status', {
            id: professorId.current,
        })
            .then(response => {
                setStatusProfessorChanged(!statusProfessorChanged)
                setModalIsOpen(false);

                if (professorStatus.current === 'ativo') {
                    toast.success('Professor desativado com sucesso', {
                        autoClose: 3000,
                    });
                } else {
                    toast.success('Professor ativado com sucesso', {
                        autoClose: 3000,
                    });
                }
            })
            .catch(error => {
                if (error.response) {
                    setModalIsOpen(false)
                    toast.error("A ação não foi executada. Tente novamente", {
                        autoClose: 4000,
                    });
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });

    }

    console.debug('currentPage', currentPage.current)
    const buildPaginatorDesign = () => {
        populatePaginator(currentPage.current, totalPages.current);
        paginationNumbers.current = getReadyPaginator();
        console.log('pagination numbers', paginationNumbers.current)
        totalPages.current = getTotalPages();
        setMountedPagination(true);
    }

    const choosePage = (e, page) => {

        e.preventDefault();
        let path;
        // tratando buscar por texto + status
        if (searchText === '') {
            path = `usuarios/todos_usuarios/professor/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/professor/${page}`
        }
        else {
            path = `usuarios/listar_usuarios/professor/${selectedValue}/${searchText}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/listar_usuarios/professoruse/${searchText}/${page}`
        }

        currentPage.current = page

        api.get(path)
            .then(response => {
                console.log(response.data);
                setNoUserFound(false);
                setUser(response.data.docs);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setNoUserFound(true)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
        buildPaginatorDesign();
    }

    return (
        <DashboardUI screenName='Professores' itemActive="Professores">
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addProfessor}
                    selectItems={selectItems}
                />
            </form>
            {noUserFound ? <h3 style={{ margin: ' 2.5rem', textAlign: 'center' }}>Nenhum usuário encontrado</h3> :
                <Table basic='very' striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>Matrícula</Table.HeaderCell>
                            <Table.HeaderCell width={6}>Nome</Table.HeaderCell>
                            <Table.HeaderCell width={6}>E-mail</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Ações</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>


                    <Table.Body>
                        {
                            user.map(({ _id, registration, name, email, status, isCoordinator }) => (
                                <Table.Row key={_id}>
                                    <Table.Cell>{registration}</Table.Cell>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{email}</Table.Cell>
                                    <Table.Cell style={{ display: 'flex !important', alignItems: 'center', position: 'relative' }}>
                                        <AiOutlineEdit cursor='pointer' onClick={() => { editProfessor(_id, registration, name, email, status, isCoordinator) }} color={light.color.primary} size='2rem' /> &nbsp;&nbsp;
                                        <Switch
                                            on='ativo'
                                            off='inativo'
                                            style={{
                                                width: '2rem',
                                                height: '1.2rem',
                                                position: 'absolute',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}
                                            styles={{
                                                trackChecked: {
                                                    backgroundColor: light.color.primary
                                                },
                                                buttonChecked: {
                                                    backgroundColor: 'white'
                                                }
                                            }}
                                            value={status}
                                            onChange={() => { activeAndInactive(_id, name, status) }} />

                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>

                    <Paginator
                        totalPages={totalPages.current}
                        currentPage={currentPage.current}
                        paginationNumbers={paginationNumbers.current}
                        choosePage={choosePage}
                    />
                </Table>
            }
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -70%)',
                        height: '180px', width: '500px', maxWidth: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around'
                    },
                    overlay: {
                        zIndex: '15',

                    }
                }}
            >
                <h1>{modalMessage.current}</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button onClick={() => changeStatusProfessor()}>Sim</Button>
                    <Button onClick={() => setModalIsOpen(false)}>Cancelar</Button>
                </div>
            </Modal>
            <ToastContainer />
        </DashboardUI>

    );
}

export default Professores;