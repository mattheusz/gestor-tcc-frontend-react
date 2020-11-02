import React, { useRef } from 'react';
import api from '../../api/api'

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
import { LeftSearchBar, RightSearchBar } from '../../components/SearchBar/SearchBar';
import { AiOutlineUserAdd } from 'react-icons/ai';

function Professores(props) {
    const [searchText, setSearchText] = useState('');
    const [professores, setProfessores] = useState([]);
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [noUserFound, setNoUserFound] = useState(false);

    const isInitialMount = useRef(true);

    useEffect(() => {

        api.get('usuarios/todos_usuarios/professor/1')
            .then(response => {
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
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        let path;
        if (searchText === '') {
            path = 'usuarios/todos_usuarios/professor/1'
        }
        else {
            path = `usuarios/listar_usuarios/${searchText}/1`;
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

    // filter useEffect
    useEffect(() => {
        console.debug(selectedValue)
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


    }, [selectedValue])

    const onChangeSelect = e => {
        setSelectedValue(e.target.value)


    }

    return (
        <DashboardUI screenName='Professores'>
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar>
                    <LeftSearchBar>
                        <BoxSearchButton>
                            <SearchInput value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Pesquisar...' />
                            <SearchButton>
                                <BiSearch style={{ color: 'white' }} />
                            </SearchButton>
                        </BoxSearchButton>
                        <Select value={selectedValue} onChange={e => onChangeSelect(e)}>
                            <option value="ativo">Ativos</option>
                            <option value="inativo">Inativos</option>
                            <option value="todos">Todos</option>
                        </Select>
                    </LeftSearchBar>
                    <RightSearchBar>
                        <Button type='submit' new={true} width='90px' >
                            Novo &nbsp;
                            <AiOutlineUserAdd />
                        </Button>
                    </RightSearchBar>
                </SearchBar>
            </form>
            {noUserFound ? <p>Nenhum usuário encontrado</p> :
                <Table striped selectable>
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
                            professores.map(({ _id, registration, name, email }) => (
                                <Table.Row key={_id}>
                                    <Table.Cell>{registration}</Table.Cell>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{email}</Table.Cell>
                                    <Table.Cell>Editar | Desativar</Table.Cell>
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