// export const coordenador = {
//     projetos: 'Projetos',
//     alunos: 'Alunos',
//     professores: 'Professores',
//     calendario: 'Calendário',
//     documentos: 'Documentos',
//     repositorio: 'Repositório',
// }

import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { VscProject } from 'react-icons/vsc';
import { IoMdSchool } from 'react-icons/io';
import { GiTeacher } from 'react-icons/gi';
import { BsCalendar } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';
import { RiGitRepositoryLine } from 'react-icons/ri';


export const coordenador = [
    {
        icon: <AiOutlineHome />,
        description: 'Home',
        to: '/home'
    },
    {
        icon: <VscProject />,
        description: 'Projetos',
        to: '/projetos'
    },
    {
        icon: <IoMdSchool />,
        description: 'Alunos',
        to: '/home'
    },
    {
        icon: <GiTeacher />,
        description: 'Professores',
        to: '/home'
    },
    {
        icon: <BsCalendar />,
        description: 'Calendário',
        to: '/home'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/home'
    },
    {
        icon: <RiGitRepositoryLine />,
        description: 'Repositório',
        to: '/home'
    },

]


const tecnicoAdministrativo = {
    projetos: 'Projetos',
    alunos: 'Alunos',
    professores: 'Professores',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}


const aluno = {
    professores: 'Professores',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}

const alunoOrientando = {
    atividades: 'Atividades',
    orientacoes: 'Orientações',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}

const professorOrientador = {
    projetos: 'Projetos',
    orientacoes: 'Orientações',
    propostas: 'Propostas',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}

