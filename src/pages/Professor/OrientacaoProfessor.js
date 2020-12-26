import React, { useRef, useState } from 'react';
import Avatar from 'react-avatar';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import StyledDropzone from '../../components/StyledDropzone/StyledDropzone';
import { device } from '../../device';
import Modal from 'react-modal';
import { MdModeEdit, MdDelete } from 'react-icons/md';

function OrientacaoProfessor(props) {

    const [fileUploading, setFileUploading] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const { register, handleSubmit, errors, formState: { isSubmitting } }
        = useForm({ mode: 'onSubmit' });

    let modalHeight = 0;

    Modal.setAppElement('#root');

    let modalMessage = useRef('')


    if (window.innerWidth <= 437) {
        modalHeight = '150px';
    } else {
        modalHeight = '120px';
    }

    console.debug('LARGURA DA TELA: ', window.innerWidth)
    console.debug('ALTURA DO MODAL: ', modalHeight)

    const onSubmit = async ({ title: comment }) => {
        console.log(comment)
        console.log(fileUploading)

        return;

        const formData = new FormData();

        formData.append("title", comment);
        formData.append("file", fileUploading);


    }


    return (
        <DashboardUI screenName='Orientação 1' itemActive="Meus Projetos" isProfessorOrientation={true}>
            <ActivityHeader>
                <ActivityDescription>
                    Auxílio online relativo a parte escrita.
                </ActivityDescription>
                <Deadline>14/02/2021</Deadline>
                <ActivitySituation>tipo</ActivitySituation>

            </ActivityHeader>

        </DashboardUI >

    );
}

export default OrientacaoProfessor;

const ActivityHeader = styled.div`
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
`;

const ActivityDescription = styled.div`
    padding: 1rem 0 .7rem;
    border-top: 1px solid ${props => props.theme.color.grey}55;
    color: ${props => props.theme.color.dark};
`;

const Deadline = styled.span`
    display: inline; 
    align-self: flex-start;
    font-size: 1rem;
    font-weight: 400;
    padding: 3px;
    border: 1px solid ${props => props.theme.color.primary};
    border-radius: 5px;
    color: ${props => props.theme.color.primary};
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
`

const ActivitySituation = styled.span`
    display: inline-block;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 3px;
    color: ${props => props.theme.color.primary};
    font-size: 1rem;
    margin-top: 7px;
    align-self: flex-start;
/*
    @media ${device.mobileL}{
        margin-top: 0;
        position: absolute;
        top: 12px;
        right: 11px;
    }

    @media ${device.tablet}{
        position: absolute;
        top: 15px;
        right: 20px;
        padding: 4px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px ${props => props.theme.color.grey}55;
    }*/
`;

