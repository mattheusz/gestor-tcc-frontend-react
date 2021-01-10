import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import api from '../../api/api'
import DashboardUI from '../../components/DashboardUI';
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function ProjetoProfessor(props) {
    const [projectInfos, setProjectInfos] = useState({});
    const [lastTask, setLastTask] = useState({});

    const isInitialMount = useRef(true);

    let professorId = useRef();
    professorId.current = localStorage.getItem('reg')
    console.log('id', professorId.current)

    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        api.get(`/projeto/${id}`)
            .then(({ data }) => {
                console.log('Projeto:', data.docs[0])
                setProjectInfos(data.docs[0]);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                }
                if (error.request) {
                    console.log(error.request, 'R E Q U I S I Ç Ã O');
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

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
            <ProjectInfo projectId={id} projectInfos={projectInfos} />
            <ToastContainer />
        </DashboardUI>

    );
}

export default ProjetoProfessor;