import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Input } from '../styled';

function Projetos(props) {
    return (
        <DashboardLayout screenName='Projetos'>
            <Input placeholder='Pesquisar' />
        </DashboardLayout>
    );
}

export default Projetos;