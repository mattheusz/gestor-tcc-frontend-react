import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import api from '../../api/api'
import DashboardUI from '../../components/DashboardUI';

import Modal from 'react-modal';
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function ProjetoProfessor(props) {
    const [projectInfos, setProjectInfos] = useState({});
    const [lastTask, setLastTask] = useState({});
    const [noActivityFound, setNoActivityFound] = useState(false);
    const [ready, setReady] = useState();




    const isInitialMount = useRef(true);

    let professorId = useRef();
    professorId.current = localStorage.getItem('reg')
    console.log('id', professorId.current)

    Modal.setAppElement('#root');

    const history = useHistory();
    const { id } = useParams();

    // carregando informações do projeto aberto
    useEffect(() => {

        // pegar projeto por id
        api.get(`/projeto/${id}`)
            .then(({ data: { docs } }) => {
                console.log('Dados do projeto', docs[0]);
                const { title, students, description, situation, tasks } = docs[0];
                setProjectInfos(docs[0]);

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

    useEffect(() => {
        api.get(`/tarefa/projeto_tarefas/${id}/1`)
            .then(({ data: { docs } }) => {
                console.log('Tarefas do projeto', docs[0]);
                const { title, students, description, situation, tasks } = docs[0];
                setLastTask(docs[0]);
                setReady(true)
                console.log(docs[0])

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
    }, [ready])

    const deleteProject = () => {
        api.delete(`/projeto/deletar_projeto/${id}`, {
            data: {
                advisorId: JSON.stringify(professorId.current)
            }
        })
            .then(({ data }) => {
                console.log('Dados que vem ao remover com sucesso:', data);
                const notify = () =>
                    toast.success("Projeto excluído com sucesso", {
                        autoClose: 2000,
                    });
                notify()
                setTimeout(() => {
                    history.push('/professor')
                }, 2000);
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
    console.debug('INFORMACOES DO PROJETO', projectInfos)

    console.debug('task 0', lastTask)

    return (
        <DashboardUI screenName={projectInfos.title} itemActive="Meus Projetos" isProfessorProject={true} deleteProject={deleteProject}>
            <ProjectInfo projectId={id} projectInfos={projectInfos} lastTask={lastTask} />
            <ToastContainer />
        </DashboardUI>

    );
}

export default ProjetoProfessor;