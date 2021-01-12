import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import usePaginatorNumbers from '../../hooks/usePaginator';
import Paginator from '../../components/Paginator/Paginator';
import styled from 'styled-components';
import { device } from '../../device';
import light from '../../themes/light';
import format from 'date-fns/format'
import ReactLoading from 'react-loading';

function ListarTarefasAluno(props) {

    const [searchText, setSearchText] = useState('');

    const [someTaskFound, setSomeTaskFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);
    const [listTasks, setListTasks] = useState();

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
    let userStatus = useRef('');

    let modalMessage = useRef('');

    let totalPages = useRef();
    let currentPage = useRef();
    let paginationNumbers = useRef([]);
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers();

    let professorId = useRef();
    professorId.current = localStorage.getItem('reg')
    console.log('id', professorId.current)

    Modal.setAppElement('#root');

    const history = useHistory();
    const { id } = useParams();

    // listar todas as tarefas de um projeto
    useEffect(() => {
        api.get(`/tarefa/projeto_tarefas/${id}/1`)
            .then(({ data: { docs } }) => {
                console.log('Tarefas do projeto', docs);
                const { title, students, description, situation, tasks } = docs;
                setListTasks(docs);
                setSomeTaskFound(true);
                setIsLoading(false);

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    const [selectedValue, setSelectedValue] = useState('ativo');
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {

        }
        api.get(``)
            .then(({ data }) => {

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, [])

    const addUser = () => {
        history.push(`/professor/projetos/${id}/atividades/novo`);
    }

    const editInfoProject = () => {

    }

    const onSubmit = e => {
        setMountedPagination(false);
        e.preventDefault();
        setFormIsSubmitted(!formIsSubmitted);
    }

    const buildPaginatorDesign = () => {
        populatePaginator(currentPage, totalPages.current);
        paginationNumbers.current = getReadyPaginator();
        totalPages.current = getTotalPages();
        setMountedPagination(true);
    }

    const onChangeSelect = e => {
        setMountedPagination(false);
        setSelectedValue(e.target.value)
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
        currentPage.current = page;

        api.get(path)
            .then(response => {
                console.log(response.data);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
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

    const openActivity = (e, idActivity) => {
        history.push(`/aluno-orientando/projeto/${id}/atividades/${idActivity}`)
    }
    return (
        <DashboardUI screenName='Atividades' itemActive="Meus Projetos">
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addUser}
                    selectItems={selectItems}
                    showAddButton={true}
                />
            </form>
            <TaskList>
                {
                    isLoading ? <Spinner type='spin' color={light.color.primaryShadow} height={20} width={20} /> :
                        someTaskFound ?
                            listTasks.map(({ _id, title, deadLine, situation }) =>
                                <TaskItem key={_id} onClick={(e) => openActivity(e, _id)}>
                                    <TaskTitle>{title}</TaskTitle><br />
                                    <TaskDeadline>
                                        Prazo de entrega: {format(new Date(deadLine), 'dd/MM/yyyy')}
                                        {console.log('deadline', deadLine)}
                                    </TaskDeadline>
                                    <TaskSituation>{situation}</TaskSituation>
                                </TaskItem>
                            ) :
                            'Nenhuma tarefa cadastrada'
                }

            </TaskList>
            <ToastContainer />
        </DashboardUI>

    );
}

const TaskList = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
`

const TaskItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1 0 115px;
    border: 1px solid ${props => props.theme.color.grey}55;
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
    position: relative;
    background-color: white;
    color: ${props => props.theme.color.dark};
    font-size: 1.2rem;
    font-weight: 300;
    padding: 1.3rem 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    border-radius: 5px;

    @media ${device.tablet}{
        border-radius: 5px;
        
    }

    &:hover{
        box-shadow: 3px 3px 3px ${props => props.theme.color.primary}75;
    }
`

const TaskTitle = styled.span`
    font-size: 1.5rem;
    font-weight: 400;
`
const TaskDeadline = styled.span`
    font-size: 1rem;
    font-weight: 400;
    padding: 3px;
    border: 1px solid ${props => props.theme.color.primary};
    border-radius: 5px;
    color: ${props => props.theme.color.primary};
    align-self: flex-start;
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
`

const TaskSituation = styled.span`
    display: inline-block;
    align-self: flex-start;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 3px;
    color: ${props => props.theme.color.primary};
    font-size: 1rem;

    @media ${device.mobileL}{
        margin-top: 0;
        position: absolute;
        bottom: 1.3rem;
        right: 11px;
    }

    @media ${device.tablet}{
        position: absolute;
        bottom: 21px;
        right: 11px;
        padding: 4px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px ${props => props.theme.color.grey}55;
    }
`;

const Spinner = styled(ReactLoading)`
    margin: 7rem auto 7rem;
`

export default ListarTarefasAluno;