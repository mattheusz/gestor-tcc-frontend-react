import React, { useRef, useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import light from '../../themes/light';

import api from '../../api/api'

import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import { Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer, toast } from 'react-toastify';
import ReactLoading from 'react-loading';
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
import { convertUTCToZonedTime } from '../../utils/convertDate';

function ListarOrientacoesAluno(props) {

    const [searchText, setSearchText] = useState('');
    const [noProjectFound, setNoProjectFound] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mountedPagination, setMountedPagination] = useState(false);
    const [formIsSubmitted, setFormIsSubmitted] = useState(true);
    const [listOrientations, setListOrientations] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [someOrientationFound, setSomeOrientationFound] = useState(false);
    const [modalOrientationInfo, setModalOrientationInfo] = useState();

    const isInitialMount = useRef(true);

    let modalMessage = useRef('');

    let totalPages = useRef();
    let currentPage = useRef();
    let paginationNumbers = useRef([]);
    const { getReadyPaginator, getTotalPages, populatePaginator } = usePaginatorNumbers();

    let professorId = useRef();
    professorId.current = localStorage.getItem('reg')
    console.log('id', professorId.current)

    const history = useHistory();
    const { projectId } = useParams();

    let breadcrumb = [
        { bread: 'Projeto', link: `/aluno-orientando/` },
        { bread: 'Orientações', link: `` },
    ];

    // carregando todas orientações
    useEffect(() => {
        // pegar projeto por id
        api.get(`/orientacao/orientacoes_projeto/${projectId}/1/1`)
            .then(({ data }) => {
                console.debug('ORIENTAÇÕES:', data);
                setListOrientations(data.docs)
                totalPages.current = data.totalPages;
                currentPage.current = data.page;
                buildPaginatorDesign();
                setSomeOrientationFound(true);
                setIsLoading(false);
                console.debug('PAGINATOR MONTADO:');
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    setIsLoading(false);
                }
                if (error.request) {
                    console.log(error.request);
                    setIsLoading(false);
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

            api.get(`/orientacao/orientacoes_projeto/${projectId}/1/1`)

            let path;
            if (searchText === '') {
                path = `/orientacao/orientacoes_projeto/${projectId}/1/1`;
            }
            else {
                path = `/orientacao/orientacoes_projeto/titulo/${projectId}/${searchText}/1/1`;
            }
            setMountedPagination(false);
            api.get(path)
                .then(({ data }) => {
                    console.debug('ORIENTAÇÕES:', data);
                    setListOrientations(data.docs)
                    totalPages.current = data.totalPages;
                    currentPage.current = data.page;
                    buildPaginatorDesign();
                    setSomeOrientationFound(true);
                    setIsLoading(false);
                    console.debug('PAGINATOR MONTADO:');
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response);
                        totalPages.current = 1;
                        setSomeOrientationFound(false)
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
    const addUser = () => {
        history.push(`/professor/projetos/${projectId}/orientacoes/novo`);
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
            path = `/orientacao/orientacoes_projeto/${projectId}/1/${page}`
        }
        else {
            path = `/orientacao/orientacoes_projeto/titulo/${projectId}/${searchText}/1/${page}`

        }
        currentPage.current = page;

        api.get(path)
            .then(response => {
                console.log(response.data);
                setNoProjectFound(false);
                setListOrientations(response.data.docs);
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

    const openOrientation = (orientationId) => {
        history.push(`/aluno-orientando/projeto/${projectId}/orientacoes/${orientationId}`)
    }

    return (
        <DashboardUI screenName='Orientações' itemActive="Meu Projeto" breadcrumb={breadcrumb}>
            <form onSubmit={(e) => onSubmit(e)}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedValue={selectedValue}
                    onChangeSelect={onChangeSelect}
                    addUser={addUser}
                    showAddButton={true}
                    noShowSelect={true}
                />
            </form>
            <OrientationList>
                {
                    isLoading ? <Spinner type='spin' color={light.color.primaryShadow} height={20} width={20} /> :
                        someOrientationFound ?
                            listOrientations.map(({ _id, title, dateOrientation, situation }) =>
                                <OrientationItem key={_id} onClick={(e) => openOrientation(_id)}>
                                    <OrientationTitle>{title}</OrientationTitle><br />
                                    <OrientationDate>
                                        {convertUTCToZonedTime(dateOrientation)}
                                    </OrientationDate>
                                </OrientationItem>
                            ) :
                            'Nenhuma orientação cadastrada'
                }

                <Paginator
                    totalPages={totalPages.current}
                    currentPage={currentPage.current}
                    paginationNumbers={paginationNumbers.current}
                    choosePage={choosePage}
                />

            </OrientationList>
            <ToastContainer />
        </DashboardUI>

    );
}

const OrientationList = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
`

const OrientationItem = styled.div`
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

const OrientationTitle = styled.span`
    font-size: 1.5rem;
    font-weight: 400;
`
const OrientationDate = styled.span`
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

const Spinner = styled(ReactLoading)`
    margin: 7rem auto 7rem;
`;


export default ListarOrientacoesAluno;