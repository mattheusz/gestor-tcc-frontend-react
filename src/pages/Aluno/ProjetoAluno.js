import React, { useRef, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import api from '../../api/api'
import DashboardUI from '../../components/DashboardUI';

import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import ProjectInfo from '../../components/ProjectInfo/ProjectInfo';

function ProjetoAluno(props) {
    const [projectName, setProjectName] = useState([]);

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
        api.get(``)
            .then(({ data }) => {

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
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {

        }
        api.get(``)
            .then(({ data }) => {

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
    }, [])

    const editInfoProject = () => {

    }

    return (
        <DashboardUI screenName='Projeto Aberto' itemActive="Meus Projetos" >
            <ProjectInfo projectId={id} isStudent={true} />
            <ToastContainer />
        </DashboardUI>

    );
}

export default ProjetoAluno;