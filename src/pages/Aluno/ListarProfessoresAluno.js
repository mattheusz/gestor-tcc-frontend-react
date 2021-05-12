import React, { useRef, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'

import api from '../../api/api'
import DashboardUI from '../../components/DashboardUI';
import SearchBar from '../../components/SearchBar';
import 'semantic-ui-css/semantic.min.css';

import { ToastContainer } from 'react-toastify';
import usePaginatorNumbers from '../../hooks/usePaginator';
import Paginator from '../../components/Paginator/Paginator';
import styled from 'styled-components';
import { device } from '../../device';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../../index.css'
import { FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";
import { TiSocialLinkedin } from "react-icons/ti";
import Lattes from '../../assets/lattes.svg';



function ListarProfessoresAluno(props) {

    const [searchText, setSearchText] = useState('');
    const [teachers, setTeachers] = useState();
    const [modalTeacherInfo, setModalTeacherInfo] = useState();
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

    let breadcrumb = [
        { bread: 'Professores', link: '' }
    ];

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

    useEffect(() => {

        // pegar projeto por id
        api.get(`/usuarios/professores_perfil/1`)
            .then(({ data }) => {
                setTeachers(data.docs)
                console.log('DOCS', data.docs)
                currentPage.current = data.page;
                totalPages.current = data.totalPages;
                buildPaginatorDesign();
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

    const [selectedValue, setSelectedValue] = useState('todos');
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let path;
            if (searchText === '') {
                path = `usuarios/professores_perfil/${selectedValue}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/professores_perfil/1`
            }
            else {
                path = `usuarios/professores_perfil/filtro/${searchText}/${selectedValue}/1`
                if (selectedValue === 'todos')
                    path = `usuarios/professores_perfil/filtro/${searchText}/1`
            }
            api.get(path)
                .then(({ data }) => {
                    setTeachers(data.docs)
                    console.log('DADOS', data)
                    currentPage.current = data.page;
                    totalPages.current = data.totalPages;
                    buildPaginatorDesign();
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
        }

    }, [selectedValue])

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
        if (searchText === '') {
            path = `usuarios/professores_perfil/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/professores_perfil/${page}`
        }
        else {
            path = `usuarios/professores_perfil/filtro/${searchText}/${selectedValue}/${page}`
            if (selectedValue === 'todos')
                path = `usuarios/professores_perfil/filtro/${searchText}/${page}`
        }

        currentPage.current = page;

        api.get(path)
            .then(({ data }) => {
                setTeachers(data.docs)
                currentPage.current = data.page;
                totalPages.current = data.totalPages;
                buildPaginatorDesign();

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
        history.push(`/professor/projetos/${id}/atividades/${idActivity}`)
    }

    const openModal = (value) => {
        setModalTeacherInfo(value);
        setModalIsOpen(true);
    }

    return (
        <DashboardUI screenName='Professores' itemActive="Professores" breadcrumb={breadcrumb}>
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
                {teachers ?
                    teachers.map((value, index) =>
                        <ProfessorCard key={index}>
                            <ProfessorCardImage>
                                <img alt={value.name} src={value && value.profilePicture && value.profilePicture.url ? value.profilePicture.url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/425px-Missing_avatar.svg.png'} />
                                {/**'https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'**/}
                            </ProfessorCardImage>
                            <ProfessorCardBody>
                                <ProfessorCardBodyName>{value.name}</ProfessorCardBodyName>
                                <ProfessorCardBodyAboutProfile>{value.researchLine}</ProfessorCardBodyAboutProfile>
                                <ProfessorAvailability available={value.available}>{value.available === 'sim' ? 'Disponível 🟢' : 'Indisponível 🔴'}</ProfessorAvailability>
                                <ProfessorCardBodyButton onClick={() => openModal(value)}>Ver mais</ProfessorCardBodyButton>
                            </ProfessorCardBody>
                        </ProfessorCard>
                    ) :
                    <p>0 professores</p>
                }

            </ProfessorList>
            <Paginator
                totalPages={totalPages.current}
                currentPage={currentPage.current}
                paginationNumbers={paginationNumbers.current}
                choosePage={choosePage}
            />
            <ToastContainer />
            <Modal
                open={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customDetailProfessorModal',
                }}

            >
                <ModalImage>
                    <img alt='Professor' src={modalTeacherInfo && modalTeacherInfo.profilePicture && modalTeacherInfo.profilePicture.url ? modalTeacherInfo.profilePicture.url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/425px-Missing_avatar.svg.png'} />
                </ModalImage>
                <ProfessorCardBodyName>
                    {modalTeacherInfo && modalTeacherInfo.name}
                </ProfessorCardBodyName>
                <p style={{ wordBreak: 'break-all', marginBottom: '5px' }}>
                    {modalTeacherInfo && modalTeacherInfo.researchLine}
                </p>
                <p>
                    Desenvolvimento de sistemas web com ênfase em Java, além de especialização elementos
                    modelagem orientada a objeto.
                </p>
                <p style={{ wordBreak: 'break-all' }}>
                    {modalTeacherInfo && modalTeacherInfo.email}
                </p>

                <ProfessorAvailability available={modalTeacherInfo && modalTeacherInfo.available}>{modalTeacherInfo && modalTeacherInfo.available === 'sim' ? 'Disponível 🟢' : 'Indisponível 🔴'}</ProfessorAvailability>
                <SocialMedias>
                    {modalTeacherInfo && modalTeacherInfo.links && modalTeacherInfo.links.lattes &&
                        <img src={Lattes} id='lattes' alt='Lattes' />
                    }
                    {modalTeacherInfo && modalTeacherInfo.links && modalTeacherInfo.links.linkedin &&
                        <a href={modalTeacherInfo.links.linkedin} target=' blank'><TiSocialLinkedin id='linkedin' /></a>
                    }
                    {modalTeacherInfo && modalTeacherInfo.links && modalTeacherInfo.links.facebook &&
                        <a href={modalTeacherInfo.links.facebook} target='blank'><FaFacebookF id='facebook' /></a>
                    }
                    {modalTeacherInfo && modalTeacherInfo.links && modalTeacherInfo.links.instagram &&
                        <FaInstagram id='instagram' />
                    }
                    {modalTeacherInfo && modalTeacherInfo.links && modalTeacherInfo.links.youtube &&
                        <FaYoutube id='youtube' />
                    }
                    {console.debug('Modal is rendering')}
                </SocialMedias>



            </Modal>
        </DashboardUI >

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
    justify-content: space-between;
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
    justify-content: center;
    font-family: 'Roboto';
`;

const ProfessorCardBodyName = styled.h3`
    color: ${props => props.theme.color.dark};
    font-size: 1.3rem;
    font-weight: 400;
    font-family: Roboto;
    letter-spacing: 1px;
    margin-bottom: 5px;
    text-align: center;
`;
const ProfessorCardBodyAboutProfile = styled.p`
    color: ${props => props.theme.color.dark};
    font-size: 1.05rem;
    font-weight: 400;
    font-family: Roboto;
    letter-spacing: 1px;
    margin-bottom: 0;
    text-align: center;
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

const ModalImage = styled.div`
    padding: .5rem .5rem;
    margin: 0 auto;
    width: 150px;
    height: 150px;

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
const SocialMedias = styled.div`
    display: block;

    svg, img{
        width: 40px;
        height: 40px;
        font-size: 40px;
        line-height: 40px;
        padding: 8px;
        border-radius: 50%;
        margin: 0 5px;
        margin-top:15px;
        background-color: ${props => props.theme.color.primary};
        color: white;
        fill: white;
        cursor: pointer;
        transition: all .2s;
       
    }

    svg[id=linkedin]:hover{
        background-color: #0077B5;
    }
    svg[id=facebook]:hover{
        background-color: #3b5999;
    }
    svg[id=instagram]:hover{
        background-color: #e4405f;
    }
    svg[id=youtube]:hover{
        background-color: #c4302b;
    }

    img[id=lattes]:hover{
        background-color: #2c2b64;
    }
`;

const ProfessorAvailability = styled.span`
    border-radius: 5px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px solid ${props => props.available === 'sim' ? props.theme.color.primary : props.theme.color.secondaryDark};
    padding: 3px;
    color: ${props => props.available === 'sim' ? props.theme.color.primary : props.theme.color.secondaryDark};
    font-size: 1rem;

`;

export default ListarProfessoresAluno;