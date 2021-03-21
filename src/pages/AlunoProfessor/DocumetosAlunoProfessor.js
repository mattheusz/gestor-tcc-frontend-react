import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';

import Modal from 'react-modal';

import { UserRegistrationContext } from '../../context/UserRegistrationContext';
import usePaginatorNumbers from '../../hooks/usePaginator';
import ActionModal from '../../components/ActionModal';
import Paginator from '../../components/Paginator/Paginator';

function DocumentosAlunoProfessor(props) {
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

    let breadcrumb = [
        { bread: 'Documentos', link: '/documentos/visualizar' }
    ];

    // carregando todos os tec administrativos ao montar componente
    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);
        api.get(`documentos/listar_todos_documentos/${currentPage}`)
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
    }, [currentPage]);

    // filtrando professor por todos, ativo e inativo
    const [selectedValue, setSelectedValue] = useState('ativo');
    const [statusUserChanged, setStatusUserChanged] = useState(false);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;

            if (searchText === '') {
                path = `usuarios/todos_usuarios/aluno/${selectedValue}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/todos_usuarios/aluno/1`
            }
            else {
                path = `usuarios/listar_usuarios/aluno/${selectedValue}/${searchText}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/listar_usuarios/aluno/${searchText}/1`
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

    // remover doccumentos (falta o back)
    const removeDocument = () => {

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
            path = `documentos/listar_todos_documentos/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/aluno/${page}`
        }
        else {
            path = `documentos/listar_todos_documentos/${page}`
            if (selectedValue === 'todos')
                path = `documentos/listar_todos_documentos/${page}`

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
        <DashboardUI screenName='Documentos' itemActive="Documentos" breadcrumb={breadcrumb}>
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    selectItems={selectItems}
                    showAddButton={true}
                    noShowSelect={true}
                />
            </form>
            {noUserFound ? <h3 style={{ margin: ' 2.5rem', textAlign: 'center' }}>Nenhum usuário encontrado</h3> :
                <Table basic='very' striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={5}>Título</Table.HeaderCell>
                            <Table.HeaderCell width={9}>Anexo</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>


                    <Table.Body>
                        {
                            user.map(({ _id, title, documentIformation: { nameDocumentation, url } }) => (
                                <Table.Row key={_id}>
                                    <Table.Cell>{title}</Table.Cell>
                                    <Table.Cell>
                                        <a href={url} target='_blank' rel="noopener">
                                            {nameDocumentation}
                                        </a>
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
                handleConfirmAction={removeDocument}
            />
            <ToastContainer />
        </DashboardUI>

    );
}

export default DocumentosAlunoProfessor;