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

function ListarProfessoresAluno(props) {

    const [searchText, setSearchText] = useState('');
    const [projects, setProjets] = useState([]);

    const [noProjectFound, setNoProjectFound] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);

    const selectItems = [
        {
            value: 'sim',
            displayValue: 'Disponíveis'
        },
        {
            value: 'não',
            displayValue: 'Indisponíveis'
        },
        {
            value: 'todos',
            displayValue: 'Todos'
        }
    ]

    const isInitialMount = useRef(true);

    let totalPages = useRef();
    let currentPage = useRef();
    let paginationNumbers = useRef([]);
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers();

    let studentId = useRef();
    studentId.current = localStorage.getItem('reg')
    console.log('id', studentId.current)

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
        history.push(`/professor/projetos/${id}/atividades/novo`);
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

    const openActivity = (e, idActivity) => {
        history.push(`/professor/projetos/${id}/atividades/${idActivity}`)
    }
    return (
        <DashboardUI screenName='Professores' itemActive="Professores">
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
            <ProfessorList>
                <ProfessorCard>
                    <ProfessorCardImage>
                        <img src='https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' />
                    </ProfessorCardImage>
                    <ProfessorCardBody>
                        <ProfessorCardBodyName>Roberto</ProfessorCardBodyName>
                        <p>Sistema web</p>
                        <ProfessorCardBodyButton>Ver mais</ProfessorCardBodyButton>
                    </ProfessorCardBody>
                </ProfessorCard>
                <ProfessorCard>
                    <ProfessorCardImage>
                        <img src='https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' />
                    </ProfessorCardImage>
                    <ProfessorCardBody>
                        <ProfessorCardBodyName>Roberto</ProfessorCardBodyName>
                        <p>Sistema web</p>
                        <ProfessorCardBodyButton>Ver mais</ProfessorCardBodyButton>
                    </ProfessorCardBody>
                </ProfessorCard>
                <ProfessorCard>
                    <ProfessorCardImage>
                        <img src='https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' />
                    </ProfessorCardImage>
                    <ProfessorCardBody>
                        <ProfessorCardBodyName>Roberto</ProfessorCardBodyName>
                        <p>Sistema web</p>
                        <ProfessorCardBodyButton>Ver mais</ProfessorCardBodyButton>
                    </ProfessorCardBody>
                </ProfessorCard>
                <ProfessorCard>
                    <ProfessorCardImage>
                        <img src='https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' />
                    </ProfessorCardImage>
                    <ProfessorCardBody>
                        <ProfessorCardBodyName>Roberto</ProfessorCardBodyName>
                        <p>Sistema web</p>
                        <ProfessorCardBodyButton>Ver mais</ProfessorCardBodyButton>
                    </ProfessorCardBody>
                </ProfessorCard>

            </ProfessorList>
            <ToastContainer />
        </DashboardUI>

    );
}

const ProfessorList = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.2rem;
    margin-top: 1rem;
    width: 100%;

    @media ${device.mobileM}{
        grid-template-columns: minmax(0, 1fr);
    }

    @media ${device.mobileL}{
        grid-template-columns: minmax(0, 1fr);
    }

    @media ${device.medium}{
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    @media ${device.tablet}{
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    @media ${device.tabletL}{
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    }

    @media ${device.laptopL}{
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    }
`;

const ProfessorCard = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.grey}55;
    box-shadow: 2px 2px 2px ${props => props.theme.color.grey}55;
    transform: translateY(0, 0);
    transition: transform .2s;

    &:hover{
        transform: translate(0, -5px);

    }


`;

const ProfessorCardImage = styled.div`
    padding: .5rem 1.5rem;
    margin: 0 auto;
    width: 90%;

    img{
        max-width: 100%;
        height: auto;
        border-radius: 50%;
    }

    @media ${device.mobileL}{

    }

    @media ${device.tablet}{

    }
`;

const ProfessorCardBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
`;

const ProfessorCardBodyName = styled.h3`
    color: ${props => props.theme.color.dark};
    font-size: 1.3rem;
    font-weight: 400;
    font-family: Roboto;
    letter-spacing: 1px;
    margin-bottom: 5px;
`;

const ProfessorCardBodyButton = styled.button`
    padding: 7px 20px;
    cursor: pointer;
    width: 100%;
    background-color: ${props => props.theme.color.primary};
    color: white;
    border: 1px solid ${props => props.theme.color.primary};
    border-radius: 5px;
    transition: all .3s;
    outline: none;

    &:hover{
        background-color: transparent;
        color: ${props => props.theme.color.primary};
        border: 1px solid ${props => props.theme.color.primary};
    }

`;


export default ListarProfessoresAluno;