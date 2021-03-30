import React, { useRef, useEffect, useState } from 'react';
import api from '../../api/api'
import DashboardUI from '../../components/DashboardUI';
import { ToastContainer, toast } from 'react-toastify';
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo';
import { useHistory, useParams } from 'react-router';

function ProjetoDetalhe(props) {
    const [projectInfo, setProjectInfo] = useState({});

    let studentId = useRef();
    studentId.current = localStorage.getItem('reg')
    console.log('id', studentId.current)

    let breadcrumb = [
        { bread: 'Projetos', link: '/projetos' },
        { bread: projectInfo.title, link: '' },
    ];

    const history = useHistory();
    const { projectId } = useParams();

    useEffect(() => {
        api.get(`/projeto/${projectId}`)
            .then(({ data }) => {
                console.log('Projeto:', data.docs[0])
                setProjectInfo(data.docs[0]);
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

    return (
        <DashboardUI screenName={projectInfo && projectInfo.title} itemActive="Projetos" breadcrumb={breadcrumb} >
            <ProjectInfo projectId={projectInfo && projectInfo._id} isCoordinator={true} projectInfos={projectInfo} />
            <ToastContainer />
        </DashboardUI>

    );
}

export default ProjetoDetalhe;