import React, { useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import StyledDropzone from '../../components/StyledDropzone/StyledDropzone';
import { device } from '../../device';
import Modal from 'react-responsive-modal';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import IconTextField, { Input } from '../../components/IconTextField'
import { AiOutlineLink } from 'react-icons/ai';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import format from 'date-fns/format'
import locale from "date-fns/locale/pt-BR"; // the locale you want
import addHours from 'date-fns/addHours'
import ErrorMessage from '../../components/Error';
import { verifyTaskSituation } from '../../utils/taskUtils';
import { convertUTCToZonedTime } from '../../utils/convertDate';

function TarefaAluno(props) {

    const [task, setTask] = useState();
    const [fileUploading, setFileUploading] = useState();
    const [modalSendActivityIsOpen, setModalSendActivityIsOpen] = useState(false);
    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [commentAddedOrDeleted, setCommentAddedOrDeleted] = useState(false);
    const [taskDelivered, setTaskDelivered] = useState(false);

    let commentHandled = useRef();
    let commentTextToEdit = useRef();
    let userId = useRef();
    userId.current = localStorage.getItem('reg')
    console.log('id', userId.current)

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch, setValue }
        = useForm({ mode: 'onSubmit' });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        errors: errorsEdit,
        formState: { isSubmitting: isSubmittingEdit } }
        = useForm({ mode: 'onSubmit' });

    const {
        register: registerDeliver,
        handleSubmit: handleSubmitDeliver,
        errors: errorsDeliver,
        watch: watchDeliver,
        setValue: setValueDeliver,
        formState: { isSubmitting: isSubmittingDeliver } }
        = useForm({ mode: 'onSubmit' });

    const watchFile = watchDeliver('file', false);
    const watchLink = watchDeliver('link', false);
    console.debug('WATCH FILE', watchFile)

    const history = useHistory();
    const { id, taskId, projectId } = useParams();
    console.log('PROJECT ID', projectId);
    let breadcrumb = [
        { bread: 'Projeto', link: `/aluno-orientando/` },
        { bread: 'Tarefas', link: `/aluno-orientando/projeto/${projectId}/tarefas` },
        { bread: task && task.title, link: `` },
    ];

    useEffect(() => {
        registerDeliver("file", { required: watchLink ? false : true });
        console.log("File sendo registrado")
    }, [register, watchLink])

    useEffect(() => {
        api.get(`/tarefa/${taskId}/`)
            .then(({ data: { docs } }) => {
                console.log('Task info', docs[0]);
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
    }, [commentAddedOrDeleted, taskDelivered]);

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

    const onSubmitTask = ({ file, link }) => {


        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        }

        if (link)
            formData.append("link", link);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        console.debug('INFORMAÇÃO A SER SUBMETIDA:', file, link)

        api.patch(`tarefas/atualizar_tarefa/aluno/${taskId}`, formData, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            }
        })
            .then(response => {
                console.log(response.data);
                closeTaskDeliverModal(false);
                setTaskDelivered(!taskDelivered)
                const notify = () =>
                    toast.success("Tarefa entregue com sucesso!", {
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

    }

    const closeTaskDeliverModal = () => {
        setModalSendActivityIsOpen(false);
        setValueDeliver('file', false);
    }



    return (
        <DashboardUI screenName={task && task.title} itemActive="Meu Projeto" breadcrumb={breadcrumb}>
            <TaskHeader>
                <TaskDescription>
                    {task && task.description}
                </TaskDescription>
                <TaskDeadline>Prazo de entrega: {task && convertUTCToZonedTime(task.deadLine)}</TaskDeadline>
                {console.log(task && addHours(new Date(task.deadLine), 3))}
                <TaskSituation>{task && verifyTaskSituation(task.situation, task.deadLine)}</TaskSituation>
                <Button type='button' width='150px' onClick={() => setModalSendActivityIsOpen(true)}>
                    Entregar tarefa
                </Button>

            </TaskHeader>
            <TaskCommentBox>
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

            </TaskCommentBox>
            <TaskCommentList>
                {task && task.comments && task.comments.length > 0 ?
                    task.comments.map(({ comment, commentUser, createdAt, _id }) =>
                        <TaskCommentListItem key={_id}>
                            <TaskCommentHeader>

                                <TaskCommentDate>
                                    {task && task.comments && format(new Date(createdAt), "dd 'de' MMMM 'de' yyyy 'às' p", { locale })}
                                </TaskCommentDate>
                                {
                                    commentUser._id === userId.current &&
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <TaskCommentIcon
                                            onClick={() => {
                                                commentHandled.current = _id;
                                                commentTextToEdit.current = comment;
                                                setModalEditIsOpen(true);
                                            }
                                            }>
                                            <MdModeEdit />
                                        </TaskCommentIcon>
                                        <TaskCommentIcon onClick={() => {
                                            console.log('id do comentario', _id)
                                            commentHandled.current = _id;
                                            setModalDeleteIsOpen(true)
                                        }}>
                                            <MdDelete />
                                        </TaskCommentIcon>
                                    </div>
                                }

                            </TaskCommentHeader>
                            <TaskCommentBody>
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
                                <TaskCommentAuthor>
                                    {commentUser.name}
                                </TaskCommentAuthor>
                            </TaskCommentBody>
                            <TaskCommentText>
                                {comment}
                            </TaskCommentText>
                        </TaskCommentListItem>
                    )
                    : <TaskCommentsNotFound>
                        Ainda não há nenhum comentário. 🙁
                    </TaskCommentsNotFound>
                }
            </TaskCommentList>

            {/* entregar tarefa */}
            <Modal
                open={modalSendActivityIsOpen}
                onClose={() => closeTaskDeliverModal()}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customEditCommentModal',
                }}
            >
                <h1>Entregar tarefa</h1>
                <TaskCommentBox >
                    <form onSubmit={handleSubmitDeliver(onSubmitTask)}>

                        <p>Arquivo:</p>
                        <StyledDropzone
                            accept='.pdf'
                            multiple={false}
                            maxSize={2097152}
                            maxFiles={1}
                            text="Arraste ou clique para adicionar o arquivo desejado."
                            setFileUploading={setFileUploading}
                            disabled={watchLink ? true : false}
                            setValue={setValueDeliver}
                        />

                        <p className='or'><span>ou</span></p>

                        <p>Link:</p>
                        <IconTextField>
                            <AiOutlineLink />
                            <Input
                                name='link'
                                disabled={watchFile ? true : false}
                                ref={registerDeliver({
                                    required: watchFile ? false : true,
                                })}
                            />
                        </IconTextField>

                        {errorsDeliver.file && errorsDeliver.link &&
                            <ErrorMessage left marginTop marginBottom>
                                Pelo menos um dos campos acima deve ser preenchido.
                            </ErrorMessage>
                        }

                        <div style={{ display: 'grid', marginTop: '.5rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                            <Button type='submit'>Entregar</Button>
                            <Button type='button' onClick={() => closeTaskDeliverModal()}>Cancelar</Button>
                        </div>
                    </form>

                </TaskCommentBox>

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
                <form onSubmit={handleSubmitEdit(onSubmitEditComment)}>
                    <TaskCommentBox style={{ marginTop: '0' }}>
                        <textarea
                            name='comment1'
                            ref={registerEdit({
                                required: true,
                            })}
                            rows={4}
                            placeholder='Digite o seu comentário...'
                            defaultValue={commentTextToEdit.current}
                        />

                    </TaskCommentBox>
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

        </DashboardUI >

    );
}

export default TarefaAluno;

const TaskHeader = styled.div`
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
`;

const TaskDescription = styled.div`
    padding: 1rem 0 .7rem;
    border-top: 1px solid ${props => props.theme.color.grey}55;
    color: ${props => props.theme.color.dark};
`;

const TaskDeadline = styled.span`
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

const TaskSituation = styled.span`
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
                        margin - top: 0;
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

const TaskCommentBox = styled.div`
    border: 1px solid ${props => props.theme.color.lightGrey};
    background-color: ${props => props.theme.color.lightGrey};
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

    p {
        margin-bottom: .2rem;
    }
`;

const TaskCommentList = styled.div`
    border-top: 1px solid ${props => props.theme.color.grey}55;
    margin-top: 1.2rem;
`;

const TaskCommentListItem = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.color.grey}55;
    margin-top: 1.2rem;
    padding: 1rem;
    border-radius: 5px;
`;

const TaskCommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

`;

const TaskCommentBody = styled.div`

`;

const TaskCommentDate = styled.p`
    color: ${props => props.theme.color.dark};
    margin-bottom: 7px;
`;

const TaskCommentIcon = styled.span`
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

const TaskCommentAuthor = styled.span`
    display: inline-block;
    color: ${props => props.theme.color.dark};
    margin-left: 5px;
    vertical-align: middle;
`;

const TaskCommentText = styled.span`
    color: ${props => props.theme.color.dark};
    margin-top: 3px;
`;

const TaskCommentsNotFound = styled.div`
color: black;;
text-align: center;
padding: 10px;
`;

const TaskCommentAttachment = styled.span`
    color: ${props => props.theme.color.dark};
    margin-top: 3px;
`;

const ModalTitle = styled.h2`
    margin-bottom: -22px;
    font-weight: 500;
    color: ${props => props.theme.color.dark};
`;
