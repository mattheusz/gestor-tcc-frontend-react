import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api';
import jwt_decode from "jwt-decode";

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import Switch from 'react-input-switch';
import Modal from 'react-modal';
import { AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import usePaginatorNumbers from '../../hooks/usePaginator';
import ActionModal from '../../components/ActionModal';
import Paginator from '../../components/Paginator/Paginator';
import { ProjectContext } from '../../context/ProjectContext';
import { detectUserType } from '../../utils/detectUserType';

function Projetos(props) {
    const [searchText, setSearchText] = useState('');
    const [user, setUser] = useState([]);

    const [noProjectFound, setProjectFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);

    const userTypeRef = useRef();



    useMemo(() => {
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        const { userType, isCoordinator, available } = decoded;
        userTypeRef.current = (detectUserType(userType, isCoordinator, available));
        console.debug("ZOIN APARECENDO", userTypeRef.current)
    })

    //const { project, setProject } = useContext(ProjectContext);

    const selectItems = [
        {
            value: 'pré-projeto',
            displayValue: 'Pré-Projeto'
        },
        {
            value: 'tcc1',
            displayValue: 'TCC 1'
        },
        {
            value: 'tcc2',
            displayValue: 'TCC 2'
        },
        {
            value: 'concluido',
            displayValue: 'Concluídos'
        },
        {
            value: 'todos',
            displayValue: 'Todos'
        }
    ]

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

    let breadcrumb = [
        { bread: 'Projetos', link: '/projetos' },
    ];

    // carregando todos os tec administrativos ao montar componente
    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);
        api.get('projeto/listar_todos/1')
            .then(({ data }) => {
                setCurrentPage(data.page);
                totalPages.current = data.totalPages;
                noProjectFound && setProjectFound(false);
                setUser(data.docs);
                buildPaginatorDesign();
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                    setProjectFound(true)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    // filtrando projeto por todos, ativo e inativo
    const [selectedValue, setSelectedValue] = useState('todos');
    const [statusUserChanged, setStatusUserChanged] = useState(false);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;

            if (searchText === '') {
                path = `projeto/listar_todos/${selectedValue}/1`;
                if (selectedValue === 'todos')
                    path = 'projeto/listar_todos/1'

            }
            else {
                path = `projeto/listar_todos/${selectedValue}/${searchText}/1`;
                if (selectedValue === 'todos')
                    path = `projeto/listar_todos/titulo/${searchText}/1`
            }
            api.get(path)
                .then(({ data }) => {
                    totalPages.current = data.totalPages;
                    setProjectFound(false)
                    setUser(data.docs)
                    setCurrentPage(data.page);
                    buildPaginatorDesign();
                })
                .catch(error => {
                    if (error.response) {
                        setProjectFound(true)
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
        history.push('/projetos/novo');
    }

    const editProject = (_id, registration, name, email, status) => {
        //setProject({ _id, registration, name, email, status })
        history.push(`/projetos/editar/${_id}`);
    }

    const seeProject = (_id) => {
        //setProject({ _id, registration, name, email, status })
        history.push(`/projetos/${_id}`);
    }

    const changeStatusUser = () => {

        api.put('usuarios/atualizar_status', {
            id: userId.current,
        })
            .then(response => {
                setStatusUserChanged(!statusUserChanged)
                setModalIsOpen(false);
                if (userStatus.current === 'ativo') {
                    toast.success('Aluno desativado com sucesso', {
                        autoClose: 3000,
                    });
                } else {
                    toast.success('Aluno ativado com sucesso', {
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
            path = `projeto/listar_todos/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `projeto/listar_todos/${page}`
        }
        else {
            path = `projeto/listar_todos/${selectedValue}/${searchText}/${page}`
            if (selectedValue === 'todos')
                path = `projeto/listar_todos/titulo/${searchText}/${page}`
        }

        setCurrentPage(page);

        api.get(path)
            .then(response => {
                console.log(response.data);
                setProjectFound(false);
                setUser(response.data.docs);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setProjectFound(true)
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
        <DashboardUI screenName='Projetos' itemActive="Projetos" breadcrumb={breadcrumb}>
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    selectItems={selectItems}
                    showAddButton={true}
                />
            </form>
            {noProjectFound ? <h3 style={{ margin: ' 2.5rem', textAlign: 'center' }}>Nenhum usuário encontrado</h3> :
                <Table basic='very' striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={5}>Projeto</Table.HeaderCell>
                            <Table.HeaderCell width={5}>Orientandos</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Orientador</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Situação</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Ações</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>


                    <Table.Body>
                        {
                            user.map(({ _id, title, students, advisor: { name }, situation, status }) => (
                                <Table.Row key={_id}>
                                    <Table.Cell>{title}</Table.Cell>
                                    <Table.Cell><p>{students[0] && students[0].name} </p>
                                        {students[1] && students[1].name}
                                    </Table.Cell>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell >{situation}</Table.Cell>
                                    <Table.Cell style={{ display: 'flex !important', alignItems: 'center', position: 'relative' }}>
                                        <AiOutlineEdit title='Editar orientador' cursor='pointer' onClick={
                                            () => { editProject(_id, title, name, situation, status) }
                                        }
                                            color={light.color.primary}
                                            size='2rem'
                                        /> &nbsp;&nbsp;
                                        {userTypeRef.current === 'coordenador' &&
                                            <AiOutlineEye
                                                title='Editar orientador'
                                                cursor='pointer'
                                                color={light.color.primary}
                                                size='2rem'
                                                onClick={
                                                    () => { seeProject(_id) }
                                                }
                                            />
                                        }
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

export default Projetos;