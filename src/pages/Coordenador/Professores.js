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

function Professores(props) {
    const [searchText, setSearchText] = useState('');
    const [olderSearchText, setOlderSearchText] = useState('');
    const [professores, setProfessores] = useState([]);

    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActive, setIsActive] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [statusProfessorChanged, setStatusProfessorChanged] = useState(false);

    const [mountedPagination, setMountedPagination] = useState(false);

    const isInitialMount = useRef(true);

    let professorName = useRef('');
    let professorId = useRef('');
    let professorStatus = useRef('')

    let modalMessage = useRef('')
    let totalPages = useRef();

    let paginationNumbers = useRef([]);
    let endPaginationNumbers = useRef([]);

    console.debug('componente renderizado')

    const { setUserRegistration } = useContext(UserRegistrationContext);

    Modal.setAppElement('#root');

    const history = useHistory();

    // carregando todos os professores ao montar componente
    useEffect(() => {
        if (mountedPagination)
            return;
        api.get('usuarios/todos_usuarios/professor/ativo/1')
            .then(({ data }) => {
                console.log('Data', data);
                setCurrentPage(data.page);
                totalPages.current = data.totalPages;
                setNoUserFound(false);
                setProfessores(data.docs);
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
    }, [statusProfessorChanged]);

    // filtrando professor por todos, ativo e inativo
    const [selectedValue, setSelectedValue] = useState('ativo');
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
                //if (selectedValue === 'todos')
                /* 
                    rota precisa ser similar ao if (selectedValue) anterior.
                    a diferença é que será passado o valor do campo de texto
                */
            }

            api.get(path)
                .then(({ data }) => {
                    setNoUserFound(false)
                    setProfessores(data.docs)
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
    }, [selectedValue])

    const onSubmit = e => {
        e.preventDefault();
        let path;

        // tratando buscar por texto + status
        if (searchText === '') {
            path = `usuarios/todos_usuarios/professor/${selectedValue}/1`
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/professor/1`
        }
        else {
            path = `usuarios/listar_usuarios/professor/${selectedValue}/${searchText}/1`
        }

        console.log('path: ', path)
        api.get(path)
            .then(({ data }) => {
                setNoUserFound(false)
                setProfessores(data.docs)
                setCurrentPage(data.page);
                totalPages.current = data.totalPages;
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
        setMountedPagination(false)
        console.debug('mounted pagination: ', mountedPagination)
        setSelectedValue(e.target.value)
    }

    const addProfessor = () => {
        history.push('/coordenador/professores/novo');
    }

    const editProfessor = (_id, registration, name, email, status, isCoordinator) => {
        setUserRegistration({ _id, registration, name, email, status, isCoordinator })
        history.push('/coordenador/professores/editar');
    }

    const activeAndInactive = (id, name, status) => {
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

    const buildPaginatorDesign = () => {
        //paginationNumbers.current = [1, 2];
        paginationNumbers.current = [];
        //totalPages.current = 5
        if (parseInt(totalPages.current) > 5) {
            // alterar aqui
            paginationNumbers.current = [
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                currentPage + 2
            ]

        } if (parseInt(totalPages.current) == parseInt(5)) {
            paginationNumbers.current = [];
            endPaginationNumbers.current = [3, 4, 5]
            paginationNumbers.current = [1, 2, ...endPaginationNumbers.current]
        }
        if (totalPages.current < 5) {
            paginationNumbers.current = [];
            for (let i = 0; i < totalPages.current; i++) {
                paginationNumbers.current[i] = i + 1;
            }
        }
        paginationNumbers.current.forEach(value => console.log('itens', value))
        setMountedPagination(true);
    }

    const choosePage = (e, page) => {

        e.preventDefault();
        let path;
        // tratando buscar por texto + status
        if (searchText === '') {
            path = `usuarios/todos_usuarios/professor/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/professor/1`
        }
        else {
            path = `usuarios/listar_usuarios/professor/${selectedValue}/${searchText}/${page}`
        }

        console.log('path: ', path)
        api.get(path)
            .then(response => {
                console.log(response.data);
                setNoUserFound(false);
                setProfessores(response.data.docs);

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
        <DashboardUI screenName='Professores' itemActive="Professores">
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addProfessor}
                />
            </form>
            {noUserFound ? <p>Nenhum usuário encontrado</p> :
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
                            professores.map(({ _id, registration, name, email, status, isCoordinator }) => (
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
                                    <Menu.Item as='a' icon>
                                        <Icon name='chevron left' />
                                        <Icon name='chevron left' />
                                    </Menu.Item>
                                    <Menu.Item as='a' icon>
                                        <Icon name='chevron left' onClick={e => {
                                            if (currentPage === 1)
                                                return;
                                            choosePage(e, currentPage - 1)
                                        }} />
                                    </Menu.Item>
                                    {paginationNumbers.current.map((value, index) =>
                                        <Menu.Item key={index} as='a' onClick={e => choosePage(e, value)}>
                                            {value}
                                        </Menu.Item>
                                    )}
                                    <Menu.Item as='a' icon>
                                        <Icon name='chevron right' />
                                    </Menu.Item>
                                    <Menu.Item as='a' icon>
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

export default Professores;