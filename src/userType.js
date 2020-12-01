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
import { BiUserCircle } from 'react-icons/bi';

export const coordenador = [
    {
        icon: <AiOutlineHome />,
        description: 'Página Inicial',
        to: '/coordenador/home'
    },
    {
        icon: <VscProject />,
        description: 'Projetos',
        to: '/coordenador/projetos'
    },
    {
        icon: <IoMdSchool />,
        description: 'Alunos',
        to: '/coordenador/alunos'
    },
    {
        icon: <GiTeacher />,
        description: 'Professores',
        to: '/coordenador/professores'
    },
    {
        icon: <BiUserCircle />,
        description: 'Técnicos Administrativos',
        to: '/coordenador/tecnicos_administrativos'
    },
    {
        icon: <BsCalendar />,
        description: 'Datas Importantes*',
        to: '/coordenador/datas_importantes'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/coordenador/documentos'
    },
    {
        icon: <RiGitRepositoryLine />,
        description: 'Repositório*',
        to: '/coordenador/trabalhos_anteriores'
    },
]


export const administrativo = [

    {
        icon: <VscProject />,
        description: 'Projetos',
        to: '/coordenador/projetos'
    },
    {
        icon: <IoMdSchool />,
        description: 'Alunos',
        to: '/coordenador/alunos'
    },
    {
        icon: <GiTeacher />,
        description: 'Professores',
        to: '/coordenador/professores'
    },
    {
        icon: <BiUserCircle />,
        description: 'Técnicos Administrativos',
        to: '/coordenador/tecnicos_administrativos'
    },
    {
        icon: <BsCalendar />,
        description: 'Datas Importantes*',
        to: '/coordenador/datas_importantes'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/coordenador/documentos'
    },
    {
        icon: <RiGitRepositoryLine />,
        description: 'Repositório*',
        to: '/coordenador/trabalhos_anteriores'
    },
]


export const alunoPreProjeto = {
    professores: 'Professores',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}

export const alunoOrientando = {
    atividades: 'Atividades',
    orientacoes: 'Orientações',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}

export const professor = {
    projetos: 'Projetos',
    orientacoes: 'Orientações',
    propostas: 'Propostas',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}

