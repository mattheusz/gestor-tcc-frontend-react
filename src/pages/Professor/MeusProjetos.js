import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import usePaginatorNumbers from '../../hooks/usePaginator';
import ActionModal from '../../components/ActionModal';
import Paginator from '../../components/Paginator/Paginator';
import { ProjectContext } from '../../context/ProjectContext';
import ProfessorProjectList from '../../components/ProfessorProjectList/ProfessorProjectList';

function Projetos(props) {
    const [searchText, setSearchText] = useState('');
    const [projects, setProjets] = useState([]);

    const [noProjectFound, setNoProjectFound] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);



    //const { project, setProject } = useContext(ProjectContext);

    const selectItems = [
        {
            value: 'em andamento',
            displayValue: 'Em andamento'
        },
        {
            value: 'todos',
            displayValue: 'Todos'
        },
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

    ]

    const isInitialMount = useRef(true);
    let userName = useRef('');
    let userId = useRef('');
    let userStatus = useRef('');

    let modalMessage = useRef('');

    let totalPages = useRef();
    let currentPage = useRef();
    let paginationNumbers = useRef([]);

    // montando paginator
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers();

    let id = useRef();
    id.current = localStorage.getItem('reg')
    console.log('id professor', id.current)

    Modal.setAppElement('#root');

    const history = useHistory();

    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);

        // pegando todos os projetos de um professor
        api.get(`/projeto/professor_projeto/em_andamento/${id.current}/1`)
            .then(({ data }) => {
                console.log('Projeto', data);
                currentPage.current = data.page;
                totalPages.current = data.totalPages;
                console.log('total de páginas', data.totalPages)
                noProjectFound && setNoProjectFound(false);
                setProjets(data.docs);
                buildPaginatorDesign();
            })
            .catch(error => {
                if (error.response) {
                    console.log('aah, que merda')
                    console.log(error.response);
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
    const [selectedValue, setSelectedValue] = useState('em andamento');
    const [statusUserChanged, setStatusUserChanged] = useState(false);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;

            if (searchText === '') {
                path = `projeto/professor_projetos/situacao/${id.current}/${selectedValue}/1`;
                if (selectedValue === 'todos')
                    path = `projeto/professor_projetos/${id.current}/1`
                if (selectedValue === 'em andamento')
                    path = `projeto/professor_projeto/em_andamento/${id.current}/1`
            }
            else {
                path = `projeto/professor_projetos/titulo/situacao/${id.current}/${searchText}/${selectedValue}/1`;
                if (selectedValue === 'todos')
                    path = `projeto/professor_projetos/titulo/${id.current}/${searchText}/1`
                if (selectedValue === 'em andamento')
                    path = `projeto/professor_projeto/em_andamento/${id.current}/${searchText}/1`
            }
            api.get(path)
                .then(({ data }) => {
                    console.debug('Projeto', data)
                    totalPages.current = data.totalPages;
                    setNoProjectFound(false)
                    setProjets(data.docs)
                    currentPage.current = data.page;
                    buildPaginatorDesign();
                })
                .catch(error => {
                    if (error.response) {
                        totalPages.current = 0;
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
        history.push('/professor/projetos/novo');
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
        console.debug('FILTRO SELECIONADO?', selectedValue)

        e.preventDefault();
        let path;
        // tratando buscar por texto + status
        if (searchText === '') {
            path = `projeto/professor_projetos/situacao/${id.current}/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `projeto/professor_projetos/${id.current}/${page}`
            if (selectedValue === 'em andamento')
                path = `projeto/professor_projeto/em_andamento/${id.current}/${page}`
        }
        else {
            path = `projeto/professor_projetos/titulo/situacao/${id.current}/${selectedValue}/${searchText}/${page}`
            if (selectedValue === 'todos')
                path = `projeto/professor_projetos/titulo/${id.current}/${searchText}/${page}`
            if (selectedValue === 'em andamento')
                path = `projeto/professor_projeto/em_andamento/${id.current}/${searchText}/${page}`
        }
        currentPage.current = page;

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
            {noProjectFound ? <h3 style={{ margin: ' 2.5rem', textAlign: 'center' }}>Nenhum projeto encontrado</h3> :
                <ProfessorProjectList projects={projects} />
            }
            <Paginator
                totalPages={totalPages.current}
                currentPage={currentPage.current}
                paginationNumbers={paginationNumbers.current}
                choosePage={choosePage}
            />
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