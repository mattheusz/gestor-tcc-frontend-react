import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import { AiOutlineEdit, AiFillDelete } from 'react-icons/ai';
import { UserRegistrationContext } from '../../context/UserRegistrationContext';
import usePaginatorNumbers from '../../hooks/usePaginator';
import { Modal } from 'react-responsive-modal';
import Paginator from '../../components/Paginator/Paginator';
import Button from '../../components/Button';

function Documentos(props) {
    const [errorMessage, setErrorMessage] = useState();
    const [searchText, setSearchText] = useState('');
    const [user, setUser] = useState([]);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [noUserFound, setNoUserFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);
    const [reloadDocuments, setReloadDocuments] = useState(false);

    const documentIdToDeleting = useRef();

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

    const history = useHistory();

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
    }, [currentPage, reloadDocuments]);

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

    const addDocument = () => {
        history.push('/documentos/novo');
    }

    const editDocument = (_id, title) => {
        history.push(`/documentos/editar/${_id}/${title}`);
    }

    const deleteDocument = () => {
        api.delete(`documentos/deletar_documento/${documentIdToDeleting.current}`)
            .then(response => {
                console.log(response.data);
                setReloadDocuments(!reloadDocuments)
                setModalDeleteIsOpen(false)
                const notify = () =>
                    toast.success("Documento excluído com sucesso", {
                        autoClose: 2000,
                    });
                notify()
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data)
                    toast.error(error.response.data, {
                        autoClose: 2000,
                    });
                }
                if (error.request) {
                    console.log(error.request);
                    toast.error(`Erro interno no servidor. Tente novamente mais tarde.`, {
                        autoClose: 2000,
                    });
                }
                else {
                    console.log('Error', error.message);
                }
            });

        return new Promise((resolve) => {
            setTimeout(() => resolve(), 3000);
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
        <DashboardUI screenName='Documentos' itemActive="Documentos">
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addDocument}
                    selectItems={selectItems}
                />
            </form>
            {noUserFound ? <h3 style={{ margin: ' 2.5rem', textAlign: 'center' }}>Nenhum usuário encontrado</h3> :
                <Table basic='very' striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={6}>Título</Table.HeaderCell>
                            <Table.HeaderCell width={6}>Anexo</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Ações</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>


                    <Table.Body>
                        {
                            user.map(({ _id, title, name, documentIformation: { nameDocumentation, url } }) => (
                                <Table.Row key={_id}>
                                    <Table.Cell>{title}</Table.Cell>
                                    <Table.Cell>
                                        <a href={url} target='_blank' rel="noopener">
                                            {nameDocumentation}
                                        </a>
                                    </Table.Cell>
                                    <Table.Cell style={{ display: 'flex !important', alignItems: 'center', position: 'relative' }}>
                                        <AiOutlineEdit
                                            title='Editar'
                                            cursor='pointer'
                                            onClick={() => { editDocument(_id, title) }}
                                            color={light.color.primary}
                                            size='1.7rem' />
                                        &nbsp;&nbsp;
                                        <AiFillDelete
                                            title='Excluir'
                                            cursor='pointer'
                                            onClick={() => {
                                                documentIdToDeleting.current = _id;
                                                setModalDeleteIsOpen(true)
                                            }}
                                            color={light.color.secondary}
                                            size='1.7rem'
                                        />
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

            {/* excluir documento */}
            <Modal
                open={modalDeleteIsOpen}
                onClose={() => setModalDeleteIsOpen(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}

            >
                <h1>Deseja excluir este documento?</h1>
                <p>Esta ação é irreversível.</p>

                <div style={{ display: 'grid', marginTop: '.1rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button onClick={() => deleteDocument()}>Sim</Button>
                    <Button onClick={() => setModalDeleteIsOpen(false)}>Cancelar</Button>
                </div>
            </Modal>
            <ToastContainer />
        </DashboardUI>

    );
}

export default Documentos;