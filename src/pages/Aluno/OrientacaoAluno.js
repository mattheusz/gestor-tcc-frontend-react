import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import api from '../../api/api';
import DashboardUI from '../../components/DashboardUI';
import { device } from '../../device';
import { convertUTCToZonedTime } from '../../utils/convertDate';

function OrientacaoAluno(props) {

    const [orientation, setOrientation] = useState();

    const { projectId, orientationId } = useParams();

    let breadcrumb = [
        { bread: 'Projeto', link: `/aluno-orientando/` },
        { bread: 'Orientações', link: `/aluno-orientando/projeto/${projectId}/orientacoes` },
        { bread: orientation && orientation.title, link: `` },
    ];

    useEffect(() => {
        api.get(`/orientacao/${orientationId}`)
            .then(({ data }) => {
                console.debug('User Info', data.docs[0]);
                setOrientation(data.docs[0]);
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

    return (
        <DashboardUI screenName={orientation && orientation.title} itemActive="Meu Projeto" i breadcrumb={breadcrumb}>
            <OrientationHeader>
                <OrientationDescription>
                    {orientation && orientation.description}
                </OrientationDescription>
                <OrientationDate>{orientation && convertUTCToZonedTime(orientation.dateOrientation)}</OrientationDate>
            </OrientationHeader>

        </DashboardUI >

    );
}

export default OrientacaoAluno;

const OrientationHeader = styled.div`
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
`;

const OrientationDescription = styled.div`
    padding: 1rem 0 .7rem;
    border-top: 1px solid ${props => props.theme.color.grey}55;
    color: ${props => props.theme.color.dark};
`;

const OrientationDate = styled.span`
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

const OrientationSituation = styled.span`
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

