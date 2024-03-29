import React, { useCallback, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import lightTheme from '../../themes/light'
import Header from '../Header';
import Sidebar from '../Sidebar';
import ViewTitle from '../ViewTitle';
import { device } from '../../device';
import DropdownUserAccount from '../DropdownUserAccount/DropdownUserAccount';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './index.css'
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useHistory, useParams } from 'react-router-dom';
import Button from '../Button';
import api from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import useDetectOutsideClick from "../../hooks/useDetectOusideClick";
import { Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function DashboardUI({ screenName,
    itemActive,
    children,
    isProfessorActivity,
    isProfessorProject,
    deleteProject,
    isProfessorOrientation,
    breadcrumb }) {

    console.log(breadcrumb);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [openDeleteActivityModal, setOpenDeleteActivityModal] = useState(false);
    const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false);
    const [openDeleteOrientationModal, setOpenDeleteOrientationModal] = useState(false);

    const history = useHistory();
    const { taskId, orientationId, projectId } = useParams();

    const redirectToOrientationList = `/professor/projetos/${projectId}/orientacoes`

    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);
    useDetectOutsideClick(dropdownRef, avatarRef, showDropdown, setShowDropdown);
    console.debug('REF', dropdownRef.current);

    const toggleToShowSidebar = useCallback(() => {
        setShowSidebar(!showSidebar)
    }, [showSidebar])

    const toggleToShowDropdown = useCallback(() => {
        setShowDropdown(!showDropdown);
        console.log('toggle dropdown', showDropdown)
    }, [showDropdown]);

    const deleteTask = () => {
        api.delete(`/tarefa/deletar_tarefa/${taskId}`)
            .then(response => {
                console.log(response.data);
                toast.success("Tarefa excluída com sucesso", {
                    autoClose: 2000,
                });
                history.push(`/professor/projetos/${projectId}/tarefas`)
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

    const deleteOrientation = () => {
        api.delete(`/orientacao/deletar_orientacao/${orientationId}`)
            .then(response => {
                console.log(response.data);
                toast.success("Orientação excluída com sucesso", {
                    autoClose: 2000,
                });
                history.push(redirectToOrientationList)
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

    return (
        <ThemeProvider theme={lightTheme}>
            <Wrapper>
                <Header
                    setShowSidebar={toggleToShowSidebar}
                    setShowDropdown={toggleToShowDropdown}
                    avatarRef={avatarRef}
                />
                <Sidebar showSidebar={showSidebar} itemActive={itemActive} />
                <Content showSidebar={showSidebar}>
                    <Main >
                        <WrapperBreadcrumb>
                            <Breadcrumb >
                                {breadcrumb &&
                                    breadcrumb.map(({ bread, link }, index) => {
                                        if (index === breadcrumb.length - 1)
                                            return (
                                                <Breadcrumb.Section key={index} style={{ fontWeight: '400' }} active>{bread}</Breadcrumb.Section>
                                            )
                                        else
                                            return (
                                                <Link key={index} to={link}>
                                                    <Breadcrumb.Section link>{bread}</Breadcrumb.Section>
                                                    <Breadcrumb.Divider icon='right angle' />
                                                </Link>
                                            )
                                    })
                                }

                            </Breadcrumb>
                        </WrapperBreadcrumb>
                        <MainCard>
                            <MainHeader>
                                <ViewTitle>{screenName}</ViewTitle>
                                {isProfessorActivity &&
                                    <HeaderButtons>
                                        <MdModeEdit title="Editar" onClick={() => history.push(`/professor/projetos/${projectId}/tarefas/editar/${taskId}`)} />
                                        <MdDelete title="Excluir" onClick={() => setOpenDeleteActivityModal(true)} />
                                    </HeaderButtons>
                                }
                                {isProfessorProject &&
                                    <HeaderButtons>
                                        <MdModeEdit title="Editar" onClick={() => history.push(`/professor/projetos/editar/${projectId}`)} />
                                        <MdDelete title="Excluir" onClick={() => setOpenDeleteProjectModal(true)} />
                                    </HeaderButtons>
                                }

                                {isProfessorOrientation &&
                                    <HeaderButtons>
                                        <MdModeEdit title="Editar" onClick={() => history.push(`/professor/projetos/${projectId}/orientacoes/editar/${orientationId}`)} />
                                        <MdDelete title="Excluir" onClick={() => setOpenDeleteOrientationModal(true)} />
                                    </HeaderButtons>
                                }

                            </MainHeader>
                            {children}
                        </MainCard>
                    </Main>
                    <Footer />
                </Content>
                <DropdownUserAccount
                    showDropdown={showDropdown}
                    dropdownRef={dropdownRef}
                    setShowDropdown={setShowDropdown}
                />
            </Wrapper>
            <Modal
                open={openDeleteProjectModal}
                onClose={() => setOpenDeleteProjectModal(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}
            >
                <h2>
                    Deseja realmente excluir este projeto?
                </h2>
                <p>
                    Esta ação é irreversível e deve ser tomada com cautela.
                </p>
                <div style={{ display: 'grid', marginTop: '.4rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button onClick={() => deleteProject()}>Excluir</Button>
                    <Button onClick={() => setOpenDeleteProjectModal(false)}>Cancelar</Button>
                </div>
            </Modal>
            <Modal
                open={openDeleteActivityModal}
                onClose={() => setOpenDeleteActivityModal(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}
            >
                <h1>
                    Deseja realmente excluir esta tarefa?
                </h1>
                <p>
                    Esta ação é irreversível
                </p>
                <div style={{ display: 'grid', marginTop: '.4rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button onClick={() => deleteTask()}>Excluir</Button>
                    <Button onClick={() => setOpenDeleteActivityModal(false)}>Cancelar</Button>
                </div>
            </Modal>
            <Modal
                open={openDeleteOrientationModal}
                onClose={() => setOpenDeleteOrientationModal(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}
            >
                <h1>
                    Deseja realmente excluir esta orientação?
                </h1>
                <p>
                    Esta ação é irreversível.
                </p>
                <div style={{ display: 'grid', marginTop: '.4rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button onClick={() => deleteOrientation()}>Excluir</Button>
                    <Button onClick={() => setOpenDeleteOrientationModal(false)}>Cancelar</Button>
                </div>
            </Modal>
            <ToastContainer style={{ zIndex: '9999999' }} />

        </ThemeProvider>
    );
}

export default DashboardUI;

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-color: white;
    position: relative;
    z-index: 1;
`


const Content = styled.div`
    position: absolute;
    width: 100%;
    /*width: ${props => props.showSidebar ? '100%' : 'calc(100% - 256px)'};*/
    margin-left: 0;
    height: calc(100vh - 60px);
    overflow: auto;
    
    top: 60px;
    scroll-margin-top: 60px;
    display: flex;
    flex-direction: column;
    transition: margin-left .3s;
    z-index: -1;

    @media ${device.mobileM}{
        /*width: ${props => props.showSidebar ? '100%' : 'calc(100% - 256px)'};*/
        margin-left: 0;
    }

    @media ${device.tablet}{
        width: ${props => props.showSidebar ? 'calc(100% - 256px)' : '100%'};
        margin-left: ${props => props.showSidebar ? '256px' : 0};
        z-index: 0;
    }

    
`

const Main = styled.main`
    flex-grow: 1;
    background-color: white;
    padding: 1rem 1rem 1rem 1.5rem;
    max-width: 100%;
    z-index: 1;
    
`
const MainCard = styled.div`
    border: 1px solid ${props => props.theme.color.grey}55;
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
    padding: 1rem;
    border-radius: 5px;
    max-width: 1050px;
    margin: 0 auto;
    position: relative;
`;

const MainHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding-bottom: .6rem;
`;

const HeaderButtons = styled.div`
    height: 25px;

    svg {
        font-size: 25px;
        cursor: pointer;
        margin-left: 5px;
        
        &:hover:nth-child(1){
            color: ${props => props.theme.color.primary};
        }

        &:hover:nth-child(2){
            color: ${props => props.theme.color.secondary};
        }
    }
`;

const Footer = styled.footer`
    height: 70px;
    background-color: white;
`;

const WrapperBreadcrumb = styled.div`
    background-color: #44444405;
    padding: 10px;
    border-radius: 5px; 
    max-width: 1050px;
    margin: 0 auto;
    margin-bottom: 5px;
`;

