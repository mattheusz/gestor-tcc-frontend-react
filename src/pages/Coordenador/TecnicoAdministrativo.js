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

function TecnicoAdministrativo(props) {
    const [searchText, setSearchText] = useState('');
    const [tecnicoAdministrativo, setTecnicoAdministrativo] = useState([]);

    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActive, setIsActive] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);


    const [mountedPagination, setMountedPagination] = useState(false);

    const isInitialMount = useRef(true);

    let tecnicoAdministrativoName = useRef('');
    let tecnicoAdministrativoId = useRef('');
    let tecnicoAdministrativoStatus = useRef('')

    let modalMessage = useRef('')
    let totalPages = useRef();

    let paginationNumbers = useRef([]);

    const { getReadyPaginator, populatePaginator } = usePaginatorNumbers()

    console.debug('componente renderizado')

    const { setUserRegistration } = useContext(UserRegistrationContext);

    Modal.setAppElement('#root');

    const history = useHistory();

    // carregando todos os professores ao montar componente
    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);
        api.get('usuarios/todos_usuarios/administrativo/ativo/1')
            .then(({ data }) => {
                console.log('Data', data);
                setCurrentPage(data.page);
                totalPages.current = data.totalPages;
                setNoUserFound(false);
                setTecnicoAdministrativo(data.docs);
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
                    setNoUserFound(false)
                    setTecnicoAdministrativo(data.docs)
                    setCurrentPage(data.page);
                    totalPages.current = data.totalPages;
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
    }, [selectedValue, statusProfessorChanged])

    const onSubmit = e => {
        setMountedPagination(false)
        e.preventDefault();
        let path;

        // tratando buscar por texto + status
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

        console.log('path: ', path)
        api.get(path)
            .then(({ data }) => {
                setNoUserFound(false)
                setTecnicoAdministrativo(data.docs)
                setCurrentPage(data.page);
                totalPages.current = data.totalPages;
                console.log('onbsubmit build pagination design');
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
    }

    const onChangeSelect = e => {
        setMountedPagination(false);
        setSelectedValue(e.target.value)
    }

    const addProfessor = () => {
        history.push('/coordenador/tecnicos_administrativos/novo');
    }

    const editProfessor = (_id, registration, name, email, status) => {
        setUserRegistration({ _id, registration, name, email, status })
        history.push(`/coordenador/tecnicos_administrativos/editar/${_id}`);
    }

    const activeAndInactive = (id, name, status) => {
        tecnicoAdministrativoId.current = id;
        tecnicoAdministrativoName.current = name;
        tecnicoAdministrativoName.current = status;

        if (status === 'ativo')
            modalMessage.current = `Deseja desativar o técnico administrativo ${tecnicoAdministrativoName.current}?`
        else
            modalMessage.current = `Deseja ativar o técnico administrativo ${tecnicoAdministrativoName.current}?`

        setModalIsOpen(true)
    }

    const changeStatusProfessor = () => {
        api.put('usuarios/atualizar_status', {
            id: tecnicoAdministrativoId.current,
        })
            .then(response => {
                setStatusProfessorChanged(!statusProfessorChanged)
                setModalIsOpen(false);

                if (tecnicoAdministrativoStatus.current === 'ativo') {
                    toast.success('Administrativo desativado com sucesso', {
                        autoClose: 3000,
                    });
                } else {
                    toast.success('Administrativo ativado com sucesso', {
                        autoClose: 3000,
                    });
                }
                setStatusProfessorChanged(!statusProfessorChanged)
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

        console.log('page: ', page)
        api.get(path)
            .then(response => {
                console.log(response.data);
                setNoUserFound(false);
                setTecnicoAdministrativo(response.data.docs);

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
                    addUser={addProfessor}
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
                            tecnicoAdministrativo.map(({ _id, registration, name, email, status, isCoordinator }) => (
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

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'>
                                <Menu floated='right' pagination>
                                    <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === 1)
                                            return;
                                        choosePage(e, 1)
                                    }}>
                                        <Icon name='chevron left' />
                                        <Icon name='chevron left' />
                                    </Menu.Item>
                                    <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === 1)
                                            return;
                                        choosePage(e, currentPage - 1)
                                    }}>
                                        <Icon name='chevron left' />
                                    </Menu.Item>

                                    {paginationNumbers.current.map((value, index) => {
                                        let activeStyle = {};
                                        if (currentPage === value)
                                            activeStyle = {
                                                backgroundColor: light.color.primary,
                                                color: 'white'
                                            }
                                        return <Menu.Item key={index} as='a' style={activeStyle} onClick={e => choosePage(e, value)}>
                                            {value}
                                        </Menu.Item>
                                    }
                                    )}

                                    <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === totalPages.current)
                                            return;
                                        choosePage(e, currentPage + 1)
                                    }}>
                                        <Icon name='chevron right' />
                                    </Menu.Item>
                                    <Menu.Item as='a' icon onClick={e => {
                                        if (currentPage === totalPages.current)
                                            return;
                                        choosePage(e, totalPages.current)
                                    }}>
                                        <Icon name='chevron right' />
                                        <Icon name='chevron right' />
                                    </Menu.Item>
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
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

export default TecnicoAdministrativo;