import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Icon, Menu, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import Switch from 'react-input-switch';
import Modal from 'react-modal';
import { AiOutlineEdit } from 'react-icons/ai';
import { UserRegistrationContext } from '../../context/UserRegistrationContext';
import Button from '../../components/Button';

function Professores(props) {
    const [searchText, setSearchText] = useState('');
    const [professores, setProfessores] = useState([]);
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActive, setIsActive] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const isInitialMount = useRef(true);

    const { setUserRegistration } = useContext(UserRegistrationContext)


    const history = useHistory();

    // carregando todos os professores ao montar componente
    useEffect(() => {
        api.get('usuarios/todos_usuarios/professor/ativo/1')
            .then(({ data }) => {
                setCurrentPage(data.page)
                setNoUserFound(false);
                setProfessores(data.docs);
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
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/professor/1`
            else
                path = `usuarios/todos_usuarios/professor/${selectedValue}/1`

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
        if (searchText === '') {
            path = 'usuarios/todos_usuarios/professor/1'
        }
        else {
            path = `usuarios/listar_usuarios/professor/${searchText}/1`;
        }

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

    const activeAndInactive = (id, status) => {
        console.log('Status:', status)
        if (status === 'ativo') {
            setModalIsOpen(true)
            // exibir modal
            // pedir pra usuário confirmar desativação
        } else {
            alert('Oi')
        }
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
                                            onChange={() => { activeAndInactive(_id, status) }} />

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
                                    </Menu.Item>
                                    <Menu.Item as='a'>1</Menu.Item>
                                    <Menu.Item as='a'>2</Menu.Item>
                                    <Menu.Item as='a'>3</Menu.Item>
                                    <Menu.Item as='a'>4</Menu.Item>
                                    <Menu.Item as='a' icon>
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
                        height: '180px', width: '500px', maxWidth: '90%'
                    },
                    overlay: {
                        zIndex: '15',

                    }
                }}
            >
                <h1>Deseja excluir?</h1>
                <p>Esta ação é irreversível</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button>Sim</Button>
                    <Button>Cancelar</Button>
                </div>
            </Modal>
        </DashboardUI>

    );
}

export default Professores;