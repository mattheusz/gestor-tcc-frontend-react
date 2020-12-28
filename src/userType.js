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
        to: '/coordenador'
    },
    {
        icon: <VscProject />,
        description: 'Projetos',
        to: '/projetos'
    },
    {
        icon: <IoMdSchool />,
        description: 'Alunos',
        to: '/alunos'
    },
    {
        icon: <GiTeacher />,
        description: 'Professores',
        to: '/professores'
    },
    {
        icon: <BiUserCircle />,
        description: 'Técnicos Administrativos',
        to: '/tecnicos_administrativos'
    },
    {
        icon: <BsCalendar />,
        description: 'Datas Importantes*',
        to: '/datas_importantes'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos'
    },
    {
        icon: <RiGitRepositoryLine />,
        description: 'Repositório*',
        to: '/trabalhos_anteriores'
    },
]


export const administrativo = [
    {
        icon: <VscProject />,
        description: 'Projetos',
        to: '/administrativo/projetos'
    },
    {
        icon: <IoMdSchool />,
        description: 'Alunos',
        to: '/alunos'
    },
    {
        icon: <GiTeacher />,
        description: 'Professores',
        to: '/professores'
    },
    {
        icon: <BiUserCircle />,
        description: 'Técnicos Administrativos',
        to: '/tecnicos_administrativos'
    },
    {
        icon: <BsCalendar />,
        description: 'Datas Importantes*',
        to: '/datas_importantes'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos'
    },
    {
        icon: <RiGitRepositoryLine />,
        description: 'Repositório*',
        to: '/trabalhos_anteriores'
    },
]


export const alunoPreProjeto = [
    {
        icon: <VscProject />,
        description: 'Professores',
        to: '/aluno-pre'
    },

    {
        icon: <BsCalendar />,
        description: 'Datas Importantes*',
        to: '/datas_importantes'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos/visualizar'
    },
    {
        icon: <RiGitRepositoryLine />,
        description: 'Repositório*',
        to: '/trabalhos_anteriores'
    },
]

export const alunoOrientando = {
    atividades: 'Atividades',
    orientacoes: 'Orientações',
    calendario: 'Calendário',
    documentos: 'Documentos',
    repositorio: 'Repositório',
}

export const professor = [

    {
        icon: <VscProject />,
        description: 'Meus Projetos',
        to: '/professor'
    },

    {
        icon: <BsCalendar />,
        description: 'Datas Importantes*',
        to: '/datas_importantes'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos/visualizar'
    },
    {
        icon: <RiGitRepositoryLine />,
        description: 'Repositório*',
        to: '/trabalhos_anteriores'
    },
]

