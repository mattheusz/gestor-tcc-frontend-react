import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Input, Menu, Icon, Form, Button, Select } from 'semantic-ui-react';
import api from '../../api/api';
import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';

function Alunos(props) {

    const [searchText, setSearchText] = useState('');
    const [alunos, setAlunos] = useState([]);
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const isInitialMount = useRef(true);

    const history = useHistory();

    // carregando todos os professores ao montar componente
    useEffect(() => {

        api.get('usuarios/todos_usuarios/aluno/1')
            .then(({ data }) => {
                console.log('Current page:', data.page)
                setCurrentPage(data.page)
                setNoUserFound(false);
                setAlunos(data.docs);

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
        console.debug(selectedValue)
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            api.get(`usuarios/todos_usuarios/aluno/${selectedValue}/1`)
                .then(response => {
                    console.log(response.data)
                    setNoUserFound(false)
                    setAlunos(response.data.docs)

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

    const onSubmit = e => {
        e.preventDefault();
        let path;
        if (searchText === '') {
            path = 'usuarios/todos_usuarios/aluno/1'
        }
        else {
            path = `usuarios/listar_usuarios/aluno/${searchText}/1`;
        }

        api.get(path)
            .then(response => {
                console.log(response.data);
                setNoUserFound(false);
                setAlunos(response.data.docs);

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

    const addAluno = () => {
        history.push('/coordenador/aluno/add');
    }

    return (
        <DashboardUI screenName='Alunos'>
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addAluno}
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
                            alunos.map(({ _id, registration, name, email }) => (
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

export default Alunos;