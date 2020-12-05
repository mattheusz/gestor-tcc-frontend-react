import React from 'react';
import styled from 'styled-components';
import { device } from '../../device';

function ProfessorProjectList({ projects }) {
    return (
        <StyledList>
            <StyledListItem>
                <h2>Mineração de dados médicos para paciente com glicemia alta e hipertensos</h2>
                <p>Guilherme Muniz</p>
                <p>Matheus Justino</p>
                <Phase>Pré-TCC</Phase>
            </StyledListItem>
            <StyledListItem>
                <h2>Mineração de dados médicos</h2>
                <p>Guilherme Muniz</p>
                <p>Matheus Justino</p>
                <Phase>Pré-TCC</Phase>
            </StyledListItem>
            <StyledListItem>
                <h2>Mineração de dados médicos</h2>
                <p>Guilherme Muniz</p>
                <p>Matheus Justino</p>
                <Phase>Pré-TCC</Phase>
            </StyledListItem>
        </StyledList>
    );
}

export default ProfessorProjectList;

const StyledList = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 0;
`;

const StyledListItem = styled.li`
    padding: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(225, 225, 225, 0.3);
    cursor: pointer;
    position: relative;
    
    &:nth-child(even){
        background-color: ${props => props.theme.color.lightPrimary}22;
    }

    h2 {
        font-weight: 400;
    }

    p{
        margin-bottom: 5px;
    }
`;

const Phase = styled.span`
    display: inline-block;
    margin-top: 3px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 5px;
    color: ${props => props.theme.color.primary};

    @media ${device.mobileL}{
        margin-top: 0;
        position: absolute;
        bottom: 20px;
        right: 20px;
    }

    @media ${device.tablet}{
        position: absolute;
        bottom: 20px;
        right: 20px;
        /*
        color: white;
        background-color: ${props => props.theme.color.primary};
        */
        padding: 7px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px ${props => props.theme.color.grey}55;
    }
`;