import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom'

import api, { getAllProfessors } from '../../api/api'

import { Icon, Menu, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import Button from '../../components/Button'
import { BiSearch } from 'react-icons/bi';

import BoxSearchButton, { SearchButton, SearchInput } from '../../components/BoxSearchButton/BoxSearchButton';
import Select from '../../components/Select'

import DashboardUI from '../../components/DashboardUI';
import { useEffect } from 'react';
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';

import { IconContext } from 'react-icons/';
import { AiOutlineEdit, AiOutlineUserAdd } from 'react-icons/ai';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import Switch from 'react-input-switch';
import light from '../../themes/light';

function Professores(props) {
    const [searchText, setSearchText] = useState('');
    const [professores, setProfessores] = useState([]);
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActive, setIsActive] = useState(true);

    const isInitialMount = useRef(true);

    const history = useHistory();

    // carregando todos os professores ao montar componente
    useEffect(() => {
        api.get('usuarios/todos_usuarios/professor/1')
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
            api.get(`usuarios/todos_usuarios/professor/${selectedValue}/1`)
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
        history.push('/coordenador/professores/add');
    }

    const editProfessor = () => {
        history.push('/coordenador/professores/add');
    }

    const activeAndInactive = (id, status) => {
        if (status === 'ativo') {
            // exibir modal
            // pedir pra usuário confirmar desativação
        } else {

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
                            <Table.HeaderCell>Matrícula</Table.HeaderCell>
                            <Table.HeaderCell>Nome</Table.HeaderCell>
                            <Table.HeaderCell>E-mail</Table.HeaderCell>
                            <Table.HeaderCell>Ações</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>


                    <Table.Body>
                        {
                            professores.map(({ _id, registration, name, email, status }) => (
                                <Table.Row key={_id}>
                                    <Table.Cell>{registration}</Table.Cell>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{email}</Table.Cell>
                                    <Table.Cell style={{ display: 'flex', alignItems: 'center' }}>
                                        <Switch on='ativo' off='inativo' value={status} onChange={() => { activeAndInactive(_id) }} />
                                        <AiOutlineEdit cursor='pointer' onClick={() => { editProfessor(_id, status) }} color={light.color.primaryShadow} size='2rem' /> &nbsp;&nbsp;
                                        {console.log('status: ', status)}
                                        {status === 'ativo' ? <BsToggleOn color={light.color.primary} size='2rem' /> : <BsToggleOff color={light.color.grey} size='2rem' />}
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
        </DashboardUI>
    );
}

export default Professores;