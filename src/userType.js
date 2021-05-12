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
import { RiGitRepositoryLine, RiExchangeBoxLine } from 'react-icons/ri';
import { BiUserCircle } from 'react-icons/bi';

export const coordenador = [
    {
        icon: <RiExchangeBoxLine />,
        description: 'Visão Professor',
        to: '/professor'
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
        description: 'Administrativos',
        to: '/tecnicos_administrativos'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos'
    },
]


export const administrativo = [
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
        description: 'Administrativos',
        to: '/tecnicos_administrativos'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos'
    },
]


export const alunoPreProjeto = [
    {
        icon: <GiTeacher />,
        description: 'Professores',
        to: '/aluno-pre'
    },
    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos/visualizar'
    },
]

export const alunoOrientando = [
    {
        icon: <VscProject />,
        description: 'Meu Projeto',
        to: '/aluno-orientando'
    },

    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos/visualizar'
    },
]

export const professor = [

    {
        icon: <VscProject />,
        description: 'Meus Projetos',
        to: '/professor'
    },

    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos/visualizar'
    },
];

export const coordenadorProfessor = [
    {
        icon: <RiExchangeBoxLine />,
        description: 'Visão Coordenador',
        to: '/coordenador'
    },
    {
        icon: <VscProject />,
        description: 'Meus Projetos',
        to: '/professor'
    },

    {
        icon: <CgFileDocument />,
        description: 'Documentos',
        to: '/documentos/visualizar'
    },
]

