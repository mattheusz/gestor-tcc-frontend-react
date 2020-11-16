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
    const [professores, setProfessores] = useState([]);

    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [isActive, setIsActive] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [statusProfessorChanged, setStatusProfessorChanged] = useState(false);

    const [mountedPagination, setMountedPagination] = useState(false);

    const isInitialMount = useRef(true);

    let professorName = useRef('');
    let professorId = useRef('');
    let professorStatus = useRef('')

    let modalMessage = useRef('')

    let paginationNumbers = useRef([]);
    let endPaginationNumbers = useRef([]);


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
                setTotalPages(data.totalPages);
                setNoUserFound(false);
                setProfessores(data.docs);
                pagination();
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
    }, [statusProfessorChanged, mountedPagination]);

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

            /*
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/professor/1`
            else
                //path = `usuarios/todos_usuarios/professor/${selectedValue}/1`
                path = `usuarios/listar_usuarios/professor/${selectedValue}/${searchText}/1`
            */

            api.get(path)
                .then(response => {
                    console.log(response.data)
                    setNoUserFound(false)
                    setProfessores(response.data.docs)
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

    const onChangeSelect = e => {
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

    const pagination = () => {
        paginationNumbers.current = [1, 2];
        if (totalPages > 5) {
            let penultimateNumber = totalPages - 1;
            endPaginationNumbers = ['...', penultimateNumber, totalPages];
            paginationNumbers.current = [...paginationNumbers.current, ...endPaginationNumbers.current]

        } else if (totalPages === 5) {
            endPaginationNumbers.current = [3, 4, 5]
            paginationNumbers.current = [...paginationNumbers.current, ...endPaginationNumbers.current]
        }
        else {
            for (let i = 0; i < totalPages; i++) {
                paginationNumbers.current[i] = i + 1;
            }
        }
        setMountedPagination(true);
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
                                        <Icon name='chevron left' />
                                    </Menu.Item>
                                    {paginationNumbers.current.map((value, index) =>
                                        <Menu.Item key={index} as='a' > {value}</Menu.Item>
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