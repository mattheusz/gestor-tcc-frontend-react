import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';

import 'semantic-ui-css/semantic.min.css';
import ReactLoading from 'react-loading';

import { ToastContainer, toast } from 'react-toastify';

import Modal from 'react-modal';

import usePaginatorNumbers from '../../hooks/usePaginator';
import Paginator from '../../components/Paginator/Paginator';
import styled from 'styled-components';
import { device } from '../../device';
import format from 'date-fns/format'
import { utcToZonedTime } from 'date-fns-tz';
import { verifyTaskSituation } from '../../utils/taskUtils';
import { convertUTCToZonedTime } from '../../utils/convertDate';

function ListarTarefasProfessor(props) {

    const [searchText, setSearchText] = useState('');

    const [someTaskFound, setSomeTaskFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);
    const [listTasks, setListTasks] = useState();

    const selectItems = [
        {
            value: 'em andamento',
            displayValue: 'Em andamento'
        },
        {
            value: 'iniciada',
            displayValue: 'Iniciada'
        },
        {
            value: 'concluída',
            displayValue: 'Concluída'
        },
        {
            value: 'recusada',
            displayValue: 'Recusada'
        },
        {
            value: 'todas',
            displayValue: 'Todas'
        }
    ];

    const isInitialMount = useRef(true);

    let userName = useRef('');
    let userId = useRef('');
    let userStatus = useRef('');

    let totalPages = useRef();
    let currentPage = useRef();
    let paginationNumbers = useRef([]);
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers();

    let professorId = useRef();
    professorId.current = localStorage.getItem('reg')
    console.log('id', professorId.current)

    Modal.setAppElement('#root');

    const history = useHistory();
    const { projectId } = useParams();

    let breadcrumb = [
        { bread: 'Meus Projetos', link: '/professor/projetos' },
        { bread: 'Projeto', link: `/professor/projetos/${projectId}` },
        { bread: 'Tarefas', link: `` },
    ];


    // listando tarefas
    useEffect(() => {
        if (mountedPagination)
            return;
        setMountedPagination(false);
        api.get(`/tarefa/projeto_tarefa/nao_concluidas/${projectId}/1/1`)
            .then(({ data }) => {
                console.debug('total pages', data.totalPages)
                console.debug('registers', data)
                currentPage.current = data.page;
                totalPages.current = data.totalPages;
                console.debug('Data zonedTimetoUtc sem format', format(utcToZonedTime(data.docs[0].deadLine), 'dd/MM/yyyy HH:MM:sszz'));
                setListTasks(data.docs);
                setSomeTaskFound(true);
                setIsLoading(false);
                buildPaginatorDesign();
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    setIsLoading(false);
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    const [selectedValue, setSelectedValue] = useState('em andamento');
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;
            if (searchText === '') {
                path = `/tarefa/projeto_tarefas/situacao/${projectId}/${selectedValue}/1/1`; //
                if (selectedValue === 'todas')
                    path = `/tarefa/projeto_tarefas/${projectId}/1/1`;
                if (selectedValue === 'em andamento')
                    path = `/tarefa/projeto_tarefa/nao_concluidas/${projectId}/1/1`
            }
            else {
                path = `/tarefa/projeto_tarefas/situacao_titulo/${projectId}/${searchText}/${selectedValue}/1/1`; //
                if (selectedValue === 'todas')
                    path = `/tarefa/projeto_tarefas/${projectId}/${searchText}/1/1`; //
                if (selectedValue === 'em andamento')
                    path = `/tarefa/projeto_tarefa/nao_concluidas/${projectId}/${searchText}/1/1`
            }
            setMountedPagination(false);
            api.get(path)
                .then(({ data }) => {
                    totalPages.current = data.totalPages;
                    currentPage.current = data.page;
                    console.log(data.docs);
                    setSomeTaskFound(true);
                    setListTasks(data.docs);
                    buildPaginatorDesign();
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response);
                        totalPages.current = 1;
                        setSomeTaskFound(false)
                    }
                    if (error.request) {
                        console.log(error.request);
                    }
                    else {
                        console.log('Error', error.message);
                    }
                });
        }

    }, [selectedValue, formIsSubmitted]);

    const addTask = () => {
        history.push(`/professor/projetos/${projectId}/tarefas/novo`);
    }

    const onSubmit = e => {
        console.debug('ONSUBMIT IS CALLED')
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
        if (searchText === '') {
            path = `/tarefa/projeto_tarefas/situacao/${projectId}/${selectedValue}/1/${page}`; //
            if (selectedValue === 'todas')
                path = `/tarefa/projeto_tarefas/${projectId}/1/${page}`;
            if (selectedValue === 'em andamento')
                path = `/tarefa/projeto_tarefa/nao_concluidas/${projectId}/1/${page}`
        }
        else {
            path = `/tarefa/projeto_tarefas/situacao_titulo/${projectId}/${searchText}/${selectedValue}/1/${page}`; //
            if (selectedValue === 'todas')
                path = `/tarefa/projeto_tarefas/${projectId}/${searchText}/1/${page}`; //
            if (selectedValue === 'em andamento')
                path = `/tarefa/projeto_tarefa/nao_concluidas/${projectId}/${searchText}/1/${page}`; //
        }
        currentPage.current = page;

        api.get(path)
            .then(response => {
                console.log(response.data);
                setListTasks(response.data.docs)

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
    };

    const openActivity = (e, idActivity) => {
        history.push(`/professor/projetos/${projectId}/tarefas/${idActivity}`)
    }



    return (
        <DashboardUI screenName='Tarefas' itemActive="Meus Projetos" breadcrumb={breadcrumb}>
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addTask}
                    selectItems={selectItems}
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
                                        Prazo de entrega: {convertUTCToZonedTime(deadLine)}
                                    </TaskDeadline>
                                    <TaskSituation>{verifyTaskSituation(situation, deadLine)}</TaskSituation>
                                </TaskItem>
                            ) :
                            <TaskNotFound>
                                Nenhuma tarefa foi encontrada
                            </TaskNotFound>
                }

            </TaskList>
            <Paginator
                totalPages={totalPages.current}
                currentPage={currentPage.current}
                paginationNumbers={paginationNumbers.current}
                choosePage={choosePage}
            />
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

const TaskNotFound = styled.div`
    color: black;
    font-family: Roboto;
    text-align: center;
    padding: 10px;
`;

export default ListarTarefasProfessor;