import React from 'react';
import styled from 'styled-components';
import DashboardUI from '../../components/DashboardUI';
import { device } from '../../device';

function AtividadeProfessor(props) {
    return (
        <DashboardUI screenName='Atividade 1' itemActive="Meus Projetos">
            <ActivityHeader>
                <ActivityDescription>
                    Uma boa introdução possui inúmeros fatores importantes, como tamanho
                    de 10 a 14 parágrafos e conter todos os elementos essenciais do projeto
                    de pesquisa, como tema, pergunta problema, justificativa, dentre outros.
                </ActivityDescription>
                <ActivitySituation>em andamento</ActivitySituation>
            </ActivityHeader>
        </DashboardUI>

    );
}

export default AtividadeProfessor;

const ActivityHeader = styled.div`
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
`;

const ActivityDescription = styled.div`
    padding: 1rem 0 1rem;
    border-top: 1px solid ${props => props.theme.color.grey}55;
    color: ${props => props.theme.color.dark};
`;

const ActivitySituation = styled.span`
    display: inline-block;
    align-self: flex-start;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 5px;
    color: ${props => props.theme.color.primary};
    font-size: 1rem;

    @media ${device.mobileL}{
        margin-top: 0;
        position: absolute;
        top: 21px;
        right: 11px;
    }

    @media ${device.tablet}{
        position: absolute;
        top: 15px;
        right: 20px;
        padding: 4px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px ${props => props.theme.color.grey}55;
    }
`;
