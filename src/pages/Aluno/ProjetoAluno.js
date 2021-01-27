import React, { useRef, useEffect, useState } from 'react';
import api from '../../api/api'
import DashboardUI from '../../components/DashboardUI';
import { ToastContainer, toast } from 'react-toastify';
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo';

function ProjetoAluno(props) {
    const [projectInfo, setProjectInfo] = useState({});

    let studentId = useRef();
    studentId.current = localStorage.getItem('reg')
    console.log('id', studentId.current)

    useEffect(() => {
        api.get(`/projeto/aluno_projetos/${studentId.current}`)
            .then(({ data }) => {
                console.log('Projeto:', data.docs[0])
                setProjectInfo(data.docs[0]);
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    const notify = () => toast.error(
                        "Erro interno no servidor. Recarregue a página novamente.",
                        {});
                    notify()
                }
                if (error.request) {
                    console.log(error.request, 'R E Q U I S I Ç Ã O');
                }
                else {
                    console.log('Error', error.message);
                }
            });
    }, []);

    return (
        <DashboardUI screenName={projectInfo && projectInfo.title} itemActive="Meu Projeto" >
            <ProjectInfo projectId={projectInfo && projectInfo._id} isStudent={true} projectInfos={projectInfo} />
            <ToastContainer />
        </DashboardUI>

    );
}

export default ProjetoAluno;