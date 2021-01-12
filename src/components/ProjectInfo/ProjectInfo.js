import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { device } from '../../device';
import format from 'date-fns/format'

function ProjectInfo({ projectId, isStudent, projectInfos }) {

    const redirectToTask = isStudent ? `/aluno-orientando/projeto/${projectId}/tarefas` : `/professor/projetos/${projectId}/atividades`
    const redirectToOrientation = isStudent ? `/aluno-orientando/projeto/${projectId}/orientacoes` : `/professor/projetos/${projectId}/orientacoes`
    const { students, description, situation, tasks, orientation, advisor } = projectInfos;
    console.debug('STUDENTS', students);
    console.debug('TASKS', tasks);

    //setDeadlineLastTask(lastTask.deadline)
    //console.log(format(new Date(lastTask.deadLine), 'dd/MM/yyyy'), 'today')

    // fazer depois a listagem da última atividade registrada

    return (
        <>
            <HeaderContainer>
                {isStudent && <h3>{advisor && advisor.name} 🎓</h3>}
                {students &&
                    <h3>{students[0].name}   {students[1] && (' e ' + students[1].name)} </h3>
                }

                <p>
                    {description && description}
                </p>

                <Situation>{situation && situation}</Situation>
            </HeaderContainer>
            <CardContainer isStudent={isStudent}>
                <TaskCard >
                    <CardHeader>
                        Tarefas
                    </CardHeader>

                    <CardBody>
                        {tasks && tasks.length > 0 ?
                            <>
                                <CardBodyTitle>{tasks && tasks.length > 0 && tasks[0].title}</CardBodyTitle>
                                <CardBodyDate>Data de entrega: {tasks && tasks.length > 0 && format(new Date(tasks[0].deadLine), 'dd/MM/yyyy')}</CardBodyDate>
                                <CardBodySituation>{tasks && tasks.length > 0 && tasks[0].situation}</CardBodySituation>
                            </> : tasks &&
                            <NoTaskInTaskCard>Nenhuma tarefa registrada. Clique em "Ver Mais" para registrar.</NoTaskInTaskCard>
                        }
                    </CardBody>

                    <CardFooter to={redirectToTask}>
                        Ver mais
                    </CardFooter>
                </TaskCard>


                <OrientationCard>
                    <CardHeader>
                        Orientações
                    </CardHeader>

                    <CardBody>
                        {orientation && orientation.length > 0 ?
                            <>
                                <CardBodyTitle>{orientation && orientation.length > 0 && orientation[0].title}</CardBodyTitle>
                                <CardBodyDate>Data de entrega: {orientation && orientation.length > 0 && format(new Date(orientation[0].deadLine), 'dd/MM/yyyy')}</CardBodyDate>

                            </> : tasks &&
                            <NoTaskInTaskCard>Nenhuma orientação registrada. Clique em "Ver Mais" para registrar.</NoTaskInTaskCard>
                        }
                    </CardBody>

                    <CardFooter to={redirectToOrientation} >
                        Ver mais
                    </CardFooter>
                </OrientationCard>

            </CardContainer>

        </>
    );
}

const HeaderContainer = styled.div`
    border-top: 1px solid ${props => props.theme.color.grey}55;
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
    width: 100%;
    position: relative;
    color: ${props => props.theme.color.dark};
    padding-top: .8rem;
    padding-bottom: .8rem;
    

    h3{
        font-family: 'Roboto', sans-serif !important;
        font-weight: 400;    
        margin-bottom: .4rem;
    }

    h3:last-of-type{
            margin-top: 0;
            margin-bottom: .4rem;
        }
`

const Situation = styled.span`
    display: inline-block;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 5px;
    color: ${props => props.theme.color.primary};

    @media ${device.mobileL}{
        margin-top: 0;
        position: absolute;
        top: .6rem;
        right: 0;
    }

    @media ${device.tablet}{
        position: absolute;
        top: .6rem;
        right: 0;
        /*
        color: white;
        background-color: ${props => props.theme.color.primary};
        */
        padding: 4px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px ${props => props.theme.color.grey}55;
    }
`;

const CardContainer = styled.div`
    display: grid;
    gap: 1rem;
    padding: 1rem 0 .5rem;
    
    @media ${device.mobileL}{
        grid-template-columns: 1fr;
    }

    @media ${device.tablet}{
        grid-template-columns: 1fr;
    }

    @media ${device.laptop}{
        grid-template-columns: ${props => props.isStudent ? '2fr 1fr' : '1fr 1fr'};
    }
`

const TaskCard = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.color.grey}55;
    border-radius: 5px;
    cursor: pointer;

    @media ${device.tablet}{
        border-radius: 5px;
        box-shadow: 3px 3px 3px ${props => props.theme.color.grey}55;
    }
`
const NoTaskInTaskCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;

`

const CardBodyTitle = styled.span`
    font-size: 1.2rem;
    font-weight: 400;
`
const CardBodySituation = styled.span`
    display: inline-block;
    border-radius: 5px;
    align-self: flex-start;
    margin-top: 10px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 3px;
    color: ${props => props.theme.color.primary};
    font-size: 1rem;

    @media ${device.mobileL}{
        margin-top: 0;
        position: absolute;
        bottom: 1.2rem;
        right: 11px;
    }

    @media ${device.tablet}{
        position: absolute;
        bottom: 1.2rem;
        right: 11px;
        padding: 3px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px ${props => props.theme.color.grey}55;
    }
`;

const CardBodyDate = styled.span`
    font-size: 1rem;
    font-weight: 400;
    margin-top: 12px;
    padding: 3px;
    border: 1px solid ${props => props.theme.color.primary};
    border-radius: 5px;
    color: ${props => props.theme.color.primary};
    align-self: flex-start;
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
`

const OrientationCard = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.color.grey}55;

    @media ${device.tablet}{
        border-radius: 5px;
        box-shadow: 3px 3px 3px ${props => props.theme.color.grey}55;
    }
`

const CardHeader = styled.div`
    /*background-color: ${props => props.theme.color.primary};
    background-color: #44444422;*/
    color: ${props => props.theme.color.dark};
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 400;
    border-radius: 5px 5px 0 0;
    padding: .8rem;
`

const CardBody = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1 0 100px;
    background-color: white;
    color: ${props => props.theme.color.dark};
    font-size: 1.2rem;
    font-weight: 300;
    padding: .8rem;
    
`

const CardFooter = styled(Link)`
    background-color: ${props => props.theme.color.secondary};
    text-align: center;
    font-size: 1.2rem;
    font-weight: 400;
    border-radius: 0 0 5px 5px;
    padding: .6rem;
    border-top: 1px solid ${props => props.theme.color.grey}55;
    color: white;

    &:hover{

        color: white;
        background-color: ${props => props.theme.color.secondaryShadow};
    }
`



export default ProjectInfo;