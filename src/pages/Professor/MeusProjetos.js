import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import Switch from 'react-input-switch';
import Modal from 'react-modal';
import { AiOutlineEdit } from 'react-icons/ai';
import usePaginatorNumbers from '../../hooks/usePaginator';
import ActionModal from '../../components/ActionModal';
import Paginator from '../../components/Paginator/Paginator';
import { ProjectContext } from '../../context/ProjectContext';
import ProfessorProjectList from '../../components/ProfessorProjectList/ProfessorProjectList';

function Projetos(props) {
    const [searchText, setSearchText] = useState('');
    const [projects, setProjets] = useState([]);

    const [noProjectFound, setNoProjectFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);

    //const { project, setProject } = useContext(ProjectContext);

    const selectItems = [
        {
            value: 'pré-tcc',
            displayValue: 'Pré-TCC'
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
            value: 'concluído',
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

    let id = useRef();
    id.current = localStorage.getItem('reg')
    console.log('id', id.current)
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers()

    Modal.setAppElement('#root');

    const history = useHistory();

    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);
        api.get(`projeto/professor_projetos/1`, {
            params: {
                id: `${id.current}`,
            }
        })
            .then(({ data }) => {
                console.log('certo encontrou')
                console.log(data)
                setCurrentPage(data.page);
                totalPages.current = data.totalPages;
                noProjectFound && setNoProjectFound(false);
                setProjets(data.docs);
                buildPaginatorDesign();
                console.log('certo encontrou')
            })
            .catch(error => {
                if (error.response) {
                    console.log('aah, que merda')
                    console.log(error.response.data);
                    setNoProjectFound(true)
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
    const [selectedValue, setSelectedValue] = useState('ativo');
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
                    setNoProjectFound(false)
                    setProjets(data.docs)
                    setCurrentPage(data.page);
                    buildPaginatorDesign();
                })
                .catch(error => {
                    if (error.response) {
                        setNoProjectFound(true)
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

    const editUser = (_id, registration, name, email, status) => {
        //setProject({ _id, registration, name, email, status })
        history.push(`/projetos/editar/${_id}`);
    }

    const activeAndInactive = (id, name, status) => {
        userId.current = id;
        userName.current = name;
        userStatus.current = status;
        setMountedPagination(false);

        if (status === 'ativo')
            modalMessage.current = `Deseja desativar o aluno ${userName.current}?`
        else
            modalMessage.current = `Deseja ativar o aluno ${userName.current}?`

        setModalIsOpen(true)
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
            path = `usuarios/todos_usuarios/aluno/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/todos_usuarios/aluno/${page}`
        }
        else {
            path = `usuarios/listar_usuarios/aluno/${selectedValue}/${searchText}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/listar_usuarios/aluno/${searchText}/${page}`
        }

        setCurrentPage(page);

        api.get(path)
            .then(response => {
                console.log(response.data);
                setNoProjectFound(false);
                setProjets(response.data.docs);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setNoProjectFound(true)
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
        <DashboardUI screenName='Meus Projetos' itemActive="Meus Projetos">
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addUser}
                    selectItems={selectItems}
                />
            </form>
            {!noProjectFound ? <h3 style={{ margin: ' 2.5rem', textAlign: 'center' }}>Nenhum projeto encontrado</h3> :
                <ProfessorProjectList projects={projects} />
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