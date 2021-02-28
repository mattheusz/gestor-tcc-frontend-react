import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import DashboardUI from '../../components/DashboardUI';
import { device } from '../../device';

function OrientacaoAluno(props) {

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

export default OrientacaoAluno;

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

