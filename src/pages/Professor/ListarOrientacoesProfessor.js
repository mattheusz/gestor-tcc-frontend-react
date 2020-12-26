import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
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
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo';
import styled from 'styled-components';
import { device } from '../../device';

function ListarOrientacoesProfessor(props) {

    const [searchText, setSearchText] = useState('');
    const [projects, setProjets] = useState([]);

    const [noProjectFound, setNoProjectFound] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);

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

    // carregando informações do projeto aberto
    useEffect(() => {

        // pegar projeto por id
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
        history.push(`/professor/projetos/${id}/orientacoes/novo`);
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

    const openOrientation = (e, idOrientation) => {
        history.push(`/professor/projetos/${id}/orientacoes/${idOrientation}`)
    }
    return (
        <DashboardUI screenName='Orientação 1' itemActive="Meus Projetos">
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
            <ActivityList>
                <ActivityItem onClick={(e) => openOrientation(e, 1)}>
                    <ActivityTitle>Introdução</ActivityTitle><br />
                    <Deadline>
                        20/01/2020
                    </Deadline>
                    <ActivitySituation>tipo</ActivitySituation>
                </ActivityItem>
                <ActivityItem>
                    <ActivityTitle>Referencial teórico</ActivityTitle><br />
                    <Deadline>
                        20/01/2020
                    </Deadline>
                    <ActivitySituation>tipo</ActivitySituation>
                </ActivityItem>
                <ActivityItem>
                    <ActivityTitle>Desenvolvimento</ActivityTitle><br />
                    <Deadline>
                        20/01/2020
                    </Deadline>
                    <ActivitySituation>tipo</ActivitySituation>
                </ActivityItem>
            </ActivityList>
            <ToastContainer />
        </DashboardUI>

    );
}

const ActivityList = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
`

const ActivityItem = styled.div`
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

const ActivityTitle = styled.span`
    font-size: 1.5rem;
    font-weight: 400;
`
const Deadline = styled.span`
    font-size: 1rem;
    font-weight: 400;
    padding: 3px;
    border: 1px solid ${props => props.theme.color.primary};
    border-radius: 5px;
    color: ${props => props.theme.color.primary};
    align-self: flex-start;
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
`

const ActivitySituation = styled.span`
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

export default ListarOrientacoesProfessor;