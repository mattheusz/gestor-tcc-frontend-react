import React, { useContext } from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Projetos from '../pages/Coordenador/Projetos';
import Alunos from '../pages/Coordenador/Alunos';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import Professores from '../pages/Coordenador/Professores';
import ProfessoresCadastrar from '../pages/Coordenador/ProfessoresCadastrar';
import ProfessoresEditar from '../pages/Coordenador/ProfessoresEditar';
import { UserRegistrationProvider } from '../context/UserRegistrationContext';
import TecnicoAdministrativo from '../pages/Coordenador/TecnicoAdministrativo';
import TecnicoAdministrativoCadastrar from '../pages/Coordenador/TecnicoAdministrativoCadastrar';
import TecnicoAdministrativoEditar from '../pages/Coordenador/TecnicoAdministrativoEditar';
import AlunoCadastrar from '../pages/Coordenador/AlunoCadastrar';
import AlunoEditar from '../pages/Coordenador/AlunoEditar';
import Documentos from '../pages/Coordenador/Documetos';
import DocumentosCadastrar from '../pages/Coordenador/DocumentosCadastrar';
import DatasImportantes from '../pages/Coordenador/DatasImportantes';
import PaginaInicial from '../pages/Coordenador/Home';



function CustomRoute({ isPrivate, roles, ...rest }) {
    const { authenticated, loading } = useContext(AuthContext)

    const userType = localStorage.getItem('userType')
    console.debug("Tipo de usuário: ", userType)

    console.debug('Is authenticated?', authenticated)

    if (loading) {
        console.log("Oh, estou carregando");
        return <h1>Loading...</h1>;
    }

    // se rota é privada, mas usuário não está autenticado, vá para o Login
    if (isPrivate && !authenticated) {
        return <Redirect to='/login' />
    }


    // se a rota pública, mas usuário está autenticado: vá para a Home
    let rootRoute;
    switch (userType) {
        case 'professor':
            rootRoute = 'professor';
            break;
        case 'aluno':
            rootRoute = 'aluno';
            break;
        case 'administrativo':
            rootRoute = 'administrativo';
            break;
        case 'coordenador':
            rootRoute = 'coordenador';
            break;

        default:
            break;
    }

    console.debug('Rota padrão: ', rootRoute)

    if (!isPrivate && authenticated) {
        return <Redirect to={`/${rootRoute}`} />
    }

    console.debug('Roles: ', roles)
    console.debug('Tipo de usuário?', userType)

    if (!roles.includes(userType) && authenticated === true) {
        return <h1>Não autorizado</h1>
    }

    console.log('Rota com rest sendo chamada');
    return <Route {...rest} />

}

export default function Routes() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <UserRegistrationProvider>
                    <Switch>
                        <CustomRoute exact roles={[]} path='/login' component={Login} />
                        <CustomRoute exact roles={[]} path='/forgot_password' component={ForgotPassword} />
                        <CustomRoute exact roles={[]} path='/reset_password/:token' component={ResetPassword} />
                        <CustomRoute exact isPrivate roles={[]} path='/home' component={PaginaInicial} />
                        {/* Coordenador */}
                        <CustomRoute exact isPrivate path='/coordenador' roles={['coordenador']} component={Projetos} />

                        <CustomRoute exact isPrivate path='/coordenador/projetos' roles={['coordenador']} component={Projetos} />
                        <CustomRoute exact isPrivate path='/coordenador/home' roles={['coordenador']} component={PaginaInicial} />
                        <CustomRoute exact isPrivate path='/coordenador/alunos' roles={['coordenador']} component={Alunos} />
                        <CustomRoute exact isPrivate path='/coordenador/alunos/novo' roles={['coordenador']} component={AlunoCadastrar} />
                        <CustomRoute exact isPrivate path='/coordenador/alunos/editar/:id' roles={['coordenador']} component={AlunoEditar} />
                        <CustomRoute exact isPrivate path='/coordenador/professores' roles={['coordenador']} component={Professores} />
                        <CustomRoute exact isPrivate path='/coordenador/professores/novo' roles={['coordenador']} component={ProfessoresCadastrar} />
                        <CustomRoute exact isPrivate path='/coordenador/professores/editar/:id' roles={['coordenador']} component={ProfessoresEditar} />
                        <CustomRoute exact isPrivate path='/coordenador/projetos' roles={['coordenador']} component={Projetos} />
                        <CustomRoute exact isPrivate path='/coordenador/tecnicos_administrativos' roles={['coordenador']} component={TecnicoAdministrativo} />
                        <CustomRoute exact isPrivate path='/coordenador/tecnicos_administrativos/novo' roles={['coordenador']} component={TecnicoAdministrativoCadastrar} />
                        <CustomRoute exact isPrivate path='/coordenador/tecnicos_administrativos/editar/:id' roles={['coordenador']} component={TecnicoAdministrativoEditar} />
                        <CustomRoute exact isPrivate path='/coordenador/datas_importantes' roles={['coordenador']} component={DatasImportantes} />
                        <CustomRoute exact isPrivate path='/coordenador/documentos' roles={['coordenador']} component={Documentos} />
                        <CustomRoute exact isPrivate path='/coordenador/documentos/novo' roles={['coordenador']} component={DocumentosCadastrar} />
                        <CustomRoute exact isPrivate path='/coordenador/trabalhos_anteriores' roles={['coordenador']} component={Projetos} />
                        <CustomRoute exact isPrivate path='/professor' roles={['professor']} component={Projetos} />

                        <CustomRoute exact isPrivate path='/professor/projetos' roles={['professor']} component={Projetos} />
                        <CustomRoute exact isPrivate path='/professor/alunos' roles={['coordenador']} component={Alunos} />
                        <CustomRoute exact isPrivate path='/professor/professores' roles={['coordenador']} component={Alunos} />
                        <CustomRoute exact isPrivate path='/professor/tec_administrativo' roles={['coordenador']} component={Alunos} />
                        <CustomRoute exact path='/'>
                            <Link to='/login'>Login</Link><hr />
                            <Link to='/forgot_password'>Esqueci a senha</Link><hr />
                            <Link to='/reset_password/123'>Resetar a senha</Link><hr />
                            <Link to='/home'>Home (em construção)</Link>
                        </CustomRoute>
                        <Route render={() => <h1>Page not found</h1>} />
                    </Switch>
                </UserRegistrationProvider>
            </AuthProvider>
        </BrowserRouter>

    );
}