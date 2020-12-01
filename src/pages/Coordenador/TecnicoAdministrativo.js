import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Icon, Menu, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import Switch from 'react-input-switch';
import Modal from 'react-modal';
import { AiOutlineEdit } from 'react-icons/ai';
import { UserRegistrationContext } from '../../context/UserRegistrationContext';
import Button from '../../components/Button';
import usePaginatorNumbers from '../../hooks/usePaginator';
import ActionModal from '../../components/ActionModal';
import Paginator from '../../components/Paginator/Paginator';

function TecnicoAdministrativo(props) {
    const [searchText, setSearchText] = useState('');
    const [user, setUser] = useState([]);

    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);

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

    const isInitialMount = useRef(true);
    let userName = useRef('');
    let userId = useRef('');
    let userStatus = useRef('')

    let modalMessage = useRef('')

    let totalPages = useRef();
    let paginationNumbers = useRef([]);
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers()

    Modal.setAppElement('#root');

    const history = useHistory();

    // carregando todos os tec administrativos ao montar componente
    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);
        api.get('usuarios/todos_usuarios/administrativo/ativo/1')
            .then(({ data }) => {
                setCurrentPage(data.page);
                totalPages.current = data.totalPages;
                noUserFound && setNoUserFound(false);
                setUser(data.docs);
                buildPaginatorDesign();
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
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
    const [statusUserChanged, setStatusUserChanged] = useState(false);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;

            if (searchText === '') {
                path = `usuarios/todos_usuarios/administrativo/${selectedValue}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/todos_usuarios/administrativo/1`
            }
            else {
                path = `usuarios/listar_usuarios/administrativo/${selectedValue}/${searchText}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/listar_usuarios/administrativo/${searchText}/1`
            }
            api.get(path)
                .then(({ data }) => {
                    totalPages.current = data.totalPages;
                    setNoUserFound(false)
                    setUser(data.docs)
                    setCurrentPage(data.page);
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
    }, [selectedValue, statusUserChanged, formIsSubmitted])

    const onSubmit = e => {
        setMountedPagination(false);
        e.preventDefault();
        setFormIsSubmitted(!formIsSubmitted);
    }

    const onChangeSelect = e => {
        setMountedPagination(false);
        setSelectedValue(e.target.value)
    }

    const addUser = () => {
        history.push('/tecnicos_administrativos/novo');
    }

    const editUser = (_id, registration, name, email, status) => {
        setUserRegistration({ _id, registration, name, email, status })
        history.push(`/tecnicos_administrativos/editar/${_id}`);
    }

    const activeAndInactive = (id, name, status) => {
        userId.current = id;
        userName.current = name;
        userStatus.current = status;
        console.log('Mounted paginator: ', mountedPagination)
        setMountedPagination(false);

        if (status === 'ativo')
            modalMessage.current = `Deseja desativar o técnico administrativo ${userName.current}?`
        else
            modalMessage.current = `Deseja ativar o técnico administrativo ${userName.current}?`

        setModalIsOpen(true)
    }

    const changeStatusUser = () => {

        api.put('usuarios/atualizar_status', {
            id: userId.current,
        })
            .then(response => {
                setStatusUserChanged(!statusUserChanged)
                setModalIsOpen(false);
                console.log('Status do tec admin', userStatus.current);
                if (userStatus.current === 'ativo') {
                    toast.success('Administrativo desativado com sucesso', {
                        autoClose: 3000,
                    });
                } else {
                    toast.success('Administrativo ativado com sucesso', {
                        autoClose: 3000,
                    });
                }
                setStatusUserChanged(!statusUserChanged)
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

    const buildPaginatorDesign = () => {
        populatePaginator(currentPage, totalPages.current);
        paginationNumbers.current = getReadyPaginator();
        totalPages.current = getTotalPages();
        setMountedPagination(true);
    }

    const choosePage = (e, page) => {

        e.preventDefault();
        let path;
        // tratando buscar por texto + status
        if (searchText === '') {
            path = `usuarios/todos_usuarios/administrativo/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/administrativo/${page}`
        }
        else {
            path = `usuarios/listar_usuarios/administrativo/${selectedValue}/${searchText}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/listar_usuarios/administrativo/${searchText}/${page}`

        }

        setCurrentPage(page);

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
    }

    return (
        <DashboardUI screenName='Técnicos Adiministrativos' itemActive="Técnicos Administrativos">
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addUser}
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
                            user.map(({ _id, registration, name, email, status }) => (
                                <Table.Row key={_id}>
                                    <Table.Cell>{registration}</Table.Cell>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{email}</Table.Cell>
                                    <Table.Cell style={{ display: 'flex !important', alignItems: 'center', position: 'relative' }}>
                                        <AiOutlineEdit cursor='pointer' onClick={() => { editUser(_id, registration, name, email, status) }} color={light.color.primary} size='2rem' /> &nbsp;&nbsp;
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
                        currentPage={currentPage}
                        paginationNumbers={paginationNumbers.current}
                        choosePage={choosePage}
                    />
                </Table>
            }
            <ActionModal
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                modalMessage={modalMessage.current}
                handleConfirmAction={changeStatusUser}
            />
            <ToastContainer />
        </DashboardUI>

    );
}

export default TecnicoAdministrativo;