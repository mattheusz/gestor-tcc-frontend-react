import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import StyledDropzone from '../../components/StyledDropzone/StyledDropzone';
import { device } from '../../device';
import { Modal } from 'react-responsive-modal';
import Avatar from 'react-avatar';
import 'react-responsive-modal/styles.css';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import '../../../src/index.css'
import api from '../../api/api';
import format from 'date-fns/format'
import locale from "date-fns/locale/pt-BR"; // the locale you want
import { toast, ToastContainer } from 'react-toastify';
import ErrorMessage from '../../components/Error/ErrorMessage';

function TarefaProfessor(props) {

    const [task, setTask] = useState();
    const [fileUploading, setFileUploading] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [commentAddedOrDeleted, setCommentAddedOrDeleted] = useState(false);
    const { register, handleSubmit, errors, formState: { isSubmitting } }
        = useForm({ mode: 'onSubmit' });

    let modalMessage = useRef('')

    const history = useHistory();
    const { id, taskId } = useParams();

    let commentHandled = useRef();
    let commentTextToEdit = useRef();
    let userId = useRef();
    userId.current = localStorage.getItem('reg')
    console.log('id', userId.current)

    useEffect(() => {
        api.get(`/tarefa/${taskId}/`)
            .then(({ data: { docs } }) => {
                console.log('Tarefas do projeto', docs[0]);
                setTask(docs[0]);
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
    }, [commentAddedOrDeleted]);

    const onSubmit = async ({ comment }, e) => {

        api.post('comentario/criar_comentario', {
            taskId,
            comment
        })
            .then(response => {
                e.target[0].value = '';
                console.log(response.data);
                setCommentAddedOrDeleted(!commentAddedOrDeleted);

                const notify = () =>
                    toast.success("Comentário feito com sucesso", {
                        autoClose: 2000,
                    });
                notify();
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
            });

        return new Promise((resolve) => {
            setTimeout(() => resolve(), 3000);
        });

        const formData = new FormData();

        formData.append("title", comment);
        formData.append("file", fileUploading);

    }

    const deleteComment = () => {
        console.log('COMENTARIO A SER REMOVIDO:', commentHandled)
        api.delete(`comentario/deletar_comentario/${commentHandled.current}`)
            .then(response => {
                console.log(response.data);
                setModalDeleteIsOpen(false)
                setCommentAddedOrDeleted(!commentAddedOrDeleted);
                const notify = () =>
                    toast.success("Comentário excluído com sucesso", {
                        autoClose: 2000,
                    });
                notify()
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data)
                    toast.error(error.response.data, {
                        autoClose: 2000,
                    });
                }
                if (error.request) {
                    console.log(error.request);
                    toast.error(`Erro interno no servidor. Tente novamente mais tarde.`, {
                        autoClose: 2000,
                    });
                }
                else {
                    console.log('Error', error.message);
                }
            });

        return new Promise((resolve) => {
            setTimeout(() => resolve(), 3000);
        });
    }

    const onSubmitEditComment = ({ comment1 }) => {
        console.log('COMENTARIO A SER EDITADO:', commentHandled)
        api.patch(`/comentario/atualizar_comentario/${commentHandled.current}`, {
            updateComment: comment1,
        })
            .then(response => {
                console.log(response.data);
                setModalEditIsOpen(false)
                setCommentAddedOrDeleted(!commentAddedOrDeleted);
                const notify = () =>
                    toast.success("Comentário editado com sucesso", {
                        autoClose: 2000,
                    });
                notify()
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data)
                    toast.error(error.response.data, {
                        autoClose: 2000,
                    });
                }
                if (error.request) {
                    console.log(error.request);
                    toast.error(`Erro interno no servidor. Tente novamente mais tarde.`, {
                        autoClose: 2000,
                    });
                }
                else {
                    console.log('Error', error.message);
                }
            });

        return new Promise((resolve) => {
            setTimeout(() => resolve(), 3000);
        });
    }

    return (
        <DashboardUI screenName={task && task.title} itemActive="Meus Projetos" isProfessorActivity={true}>
            <ActivityHeader>
                {task &&
                    <>
                        <ActivityDescription>
                            {task && task.description}
                        </ActivityDescription>
                        <Deadline>Prazo de entrega: {task && format(new Date(task.deadLine), 'dd/MM/yyyy')}</Deadline>
                        <ActivitySituation>{task && task.situation}</ActivitySituation>
                        <Button type='button' width='150px'>
                            Finalizar atividade
                        </Button>
                    </>
                }

            </ActivityHeader>
            <ActivityCommentBox>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        name='comment'
                        ref={register({
                            required: true,
                        })}
                        rows={4}
                        placeholder='Digite o seu comentário...'
                        style={errors.comment && { borderColor: lightTheme.color.secondary }}

                    />
                    {errors.comment && errors.comment.type === 'required' && <ErrorMessage left>Um texto é obrigatório para efetuar um comentário</ErrorMessage>}
                    <Button type='submit' width='100px' disabled={isSubmitting}>
                        Comentar
                    </Button>
                </form>

            </ActivityCommentBox>
            <ActivityCommentList>
                {task && task.comments && task.comments.length > 0 ?
                    task.comments.map(({ comment, commentUser, createdAt, _id }) =>
                        <ActivityCommentListItem key={_id}>
                            <ActivityCommentHeader>

                                <ActivityCommentDate>
                                    {task && task.comments && format(new Date(createdAt), "dd 'de' MMMM 'de' yyyy 'às' p", { locale })}
                                </ActivityCommentDate>
                                {
                                    commentUser._id === userId.current &&
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <ActivityCommentIcon
                                            onClick={() => {
                                                commentHandled.current = _id;
                                                setModalEditIsOpen(true);
                                            }
                                            }>
                                            <MdModeEdit />
                                        </ActivityCommentIcon>
                                        <ActivityCommentIcon onClick={() => {
                                            console.log('id do comentario', _id)
                                            commentHandled.current = _id;
                                            commentTextToEdit.current = comment;
                                            setModalDeleteIsOpen(true)
                                        }}>
                                            <MdDelete />
                                        </ActivityCommentIcon>
                                    </div>
                                }

                            </ActivityCommentHeader>
                            <ActivityCommentBody>
                                <Avatar
                                    round
                                    color={lightTheme.color.primary}
                                    size='1.5rem'
                                    textSizeRatio={1}
                                    name='Matheus Justino'
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                />
                                <ActivityCommentAuthor>
                                    {commentUser.name}
                                </ActivityCommentAuthor>
                            </ActivityCommentBody>
                            <ActivityCommentText>
                                {comment}
                            </ActivityCommentText>
                        </ActivityCommentListItem>
                    )
                    : 'Comment not found'
                }
            </ActivityCommentList>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -70%)',
                        height: '270px', width: '500px', maxWidth: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    },
                    overlay: {
                        zIndex: '15',

                    }
                }}
            >
                <ModalTitle>Entregar...</ModalTitle>
                <ActivityCommentBox >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <textarea
                            name='comment'
                            ref={register({
                                required: true,
                            })}
                            rows={2}
                            placeholder='Digite o seu comentário...' />
                        <StyledDropzone
                            accept='.pdf'
                            multiple={false}
                            maxSize={2097152}
                            text="Arraste ou clique para adicionar o arquivo desejado."
                            setFileUploading={setFileUploading}
                        />
                    </form>

                </ActivityCommentBox>
                <div style={{ display: 'grid', marginTop: '-1.2rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button onClick={() => setModalIsOpen(false)}>Entregar</Button>
                    <Button onClick={() => setModalIsOpen(false)}>Cancelar</Button>
                </div>
            </Modal>

            {/* editar comentário */}

            <Modal
                open={modalEditIsOpen}
                onClose={() => setModalEditIsOpen(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customEditCommentModal',
                }}
            >
                <h1>Editar comentário</h1>
                <form onSubmit={handleSubmit(onSubmitEditComment)}>
                    <ActivityCommentBox style={{ marginTop: '0' }}>
                        <textarea
                            name='comment1'
                            ref={register({
                                required: true,
                            })}
                            rows={4}
                            placeholder='Digite o seu comentário...'
                            defaultValue={commentTextToEdit.current}
                        />

                    </ActivityCommentBox>
                    <div style={{ display: 'grid', marginTop: '.5rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                        <Button onClick={() => setModalEditIsOpen(false)}>Editar</Button>
                        <Button onClick={() => setModalEditIsOpen(false)}>Cancelar</Button>
                    </div>
                </form>
            </Modal>

            {/* excluir comentário */}


            <Modal
                open={modalDeleteIsOpen}
                onClose={() => setModalDeleteIsOpen(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}

            >
                <h1>Deseja remover este comentário?</h1>
                <p>Esta ação é irreversível.</p>

                <div style={{ display: 'grid', marginTop: '.1rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                    <Button onClick={() => deleteComment()}>Sim</Button>
                    <Button onClick={() => setModalDeleteIsOpen(false)}>Cancelar</Button>
                </div>
            </Modal>
            <ToastContainer style={{ zIndex: '9999999' }} />
        </DashboardUI >

    );
}

export default TarefaProfessor;

const ActivityHeader = styled.div`
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
`;

const ActivityDescription = styled.div`
    padding: 1rem 0 .7rem;
    border-top: 1px solid ${props => props.theme.color.grey}55;
    color: ${props => props.theme.color.dark};
`;

const Deadline = styled.span`
    display: inline; 
    align-self: flex-start;
    font-size: 1rem;
    font-weight: 400;
    padding: 3px;
    border: 1px solid ${props => props.theme.color.primary};
    border-radius: 5px;
    color: ${props => props.theme.color.primary};
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
`

const ActivitySituation = styled.span`
    display: inline-block;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 3px;
    color: ${props => props.theme.color.primary};
    font-size: 1rem;
    margin-top: 7px;
    align-self: flex-start;
/*
    @media ${device.mobileL}{
        margin-top: 0;
        position: absolute;
        top: 12px;
        right: 11px;
    }

    @media ${device.tablet}{
        position: absolute;
        top: 15px;
        right: 20px;
        padding: 4px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px ${props => props.theme.color.grey}55;
    }*/
`;

const ActivityCommentBox = styled.div`
    border: 1px solid ${props => props.theme.color.grey}55;
    background: ${props => props.theme.color.grey}55;
    border-radius: 5px;
    margin-top: 1.2rem;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;

    textarea { 
        resize: none;
        width: 100%;
        border: 1px solid ${props => props.theme.color.grey};
        color: ${props => props.theme.color.dark};
        padding: 5px;
        font-family: 'Roboto', sans-serif !important;
        outline: none;
        
        &:focus{
            border: 1px solid ${props => props.theme.color.primary};
        }
    }
`;

const ActivityCommentList = styled.div`
    border-top: 1px solid ${props => props.theme.color.grey}55;
    margin-top: 1.2rem;
`;

const ActivityCommentListItem = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.color.grey}55;
    margin-top: 1.2rem;
    padding: 1rem;
    border-radius: 5px;
`;

const ActivityCommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ActivityCommentBody = styled.div`

`;

const ActivityCommentDate = styled.p`
    color: ${props => props.theme.color.dark};
    margin-bottom: 7px;
`;

const ActivityCommentIcon = styled.span`
    color: ${props => props.theme.color.dark};
    margin-bottom: 7px;
    margin-left: 5px;
    font-size: 20px;
    cursor: pointer;

    &:hover:nth-child(1){
        color: ${props => props.theme.color.primary};
    }
    &:hover:nth-child(2){
        color: ${props => props.theme.color.secondary};
    }
`;

const ActivityCommentAuthor = styled.span`
    display: inline-block;
    color: ${props => props.theme.color.dark};
    margin-left: 5px;
    vertical-align: middle;
`;

const ActivityCommentText = styled.span`
    color: ${props => props.theme.color.dark};
    margin-top: 3px;
`;

const ActivityCommentAttachment = styled.span`
    color: ${props => props.theme.color.dark};
    margin-top: 3px;
`;

const ModalTitle = styled.h2`
    
    font-weight: 500;
    color: ${props => props.theme.color.dark};
    text-align: center;
`;
