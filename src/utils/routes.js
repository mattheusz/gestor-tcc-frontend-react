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
import VerPerfil from '../pages/Geral/VerPerfil';
import MeusProjetos from '../pages/Professor/MeusProjetos';



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
            rootRoute = 'alunos';
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
                        <CustomRoute exact roles={[]} path='/' component={Login} />
                        <CustomRoute exact roles={[]} path='/forgot_password' component={ForgotPassword} />
                        <CustomRoute exact roles={[]} path='/reset_password/:token' component={ResetPassword} />
                        <CustomRoute exact isPrivate roles={[]} path='/home' component={PaginaInicial} />

                        {/* Geral */}
                        <CustomRoute exact isPrivate roles={['coordenador', 'administrativo', 'professor', 'aluno']} path='/perfil' component={VerPerfil} />

                        {/* Coordenador */}
                        <CustomRoute exact isPrivate path='/coordenador/projetos' roles={['coordenador']} component={Projetos} />
                        <CustomRoute exact isPrivate path='/coordenador' roles={['coordenador']} component={PaginaInicial} />

                        {/* Coordenador + Admin */}
                        <CustomRoute exact isPrivate path='/alunos' roles={['coordenador', 'administrativo']} component={Alunos} />
                        <CustomRoute exact isPrivate path='/alunos/novo' roles={['coordenador', 'administrativo']} component={AlunoCadastrar} />
                        <CustomRoute exact isPrivate path='/alunos/editar/:id' roles={['coordenador']} component={AlunoEditar} />
                        <CustomRoute exact isPrivate path='/professores' roles={['coordenador', 'administrativo']} component={Professores} />
                        <CustomRoute exact isPrivate path='/professores/novo' roles={['coordenador', 'administrativo']} component={ProfessoresCadastrar} />
                        <CustomRoute exact isPrivate path='/professores/editar/:id' roles={['coordenador', 'administrativo']} component={ProfessoresEditar} />
                        <CustomRoute exact isPrivate path='/projetos' roles={['coordenador']} component={Projetos} />
                        <CustomRoute exact isPrivate path='/tecnicos_administrativos' roles={['coordenador', 'administrativo']} component={TecnicoAdministrativo} />
                        <CustomRoute exact isPrivate path='/tecnicos_administrativos/novo' roles={['coordenador', 'administrativo']} component={TecnicoAdministrativoCadastrar} />
                        <CustomRoute exact isPrivate path='/tecnicos_administrativos/editar/:id' roles={['coordenador', 'administrativo']} component={TecnicoAdministrativoEditar} />
                        <CustomRoute exact isPrivate path='/datas_importantes' roles={['coordenador', 'administrativo']} component={DatasImportantes} />
                        <CustomRoute exact isPrivate path='/documentos' roles={['coordenador', 'administrativo']} component={Documentos} />
                        <CustomRoute exact isPrivate path='/documentos/novo' roles={['coordenador', 'administrativo']} component={DocumentosCadastrar} />
                        <CustomRoute exact isPrivate path='/trabalhos_anteriores' roles={['coordenador', 'administrativo']} component={Projetos} />

                        {/* Professor */}
                        <CustomRoute exact isPrivate path='/professor' roles={['professor']} component={MeusProjetos} />

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