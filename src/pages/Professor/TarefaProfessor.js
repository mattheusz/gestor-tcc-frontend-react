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
import { HiOutlineLink } from 'react-icons/hi';
import StyledDatePicker from '../../components/StyledDatePicker';
import '../../../src/index.css'
import api from '../../api/api';
import format from 'date-fns/format'
import locale from "date-fns/locale/pt-BR"; // the locale you want
import { utcToZonedTime } from 'date-fns-tz';
import addHours from 'date-fns/addHours'
import { toast, ToastContainer } from 'react-toastify';
import ErrorMessage from '../../components/Error/ErrorMessage';
import Checkbox from '../../components/Checkbox';
import Label from '../../components/Label/Label';
import light from '../../themes/light';
import { verifyTaskSituation } from '../../utils/taskUtils';
import { convertUTCToZonedTime, convertZonedTimeToUTC } from '../../utils/convertDate';
import { parseISO } from 'date-fns';


function TarefaProfessor(props) {

    const [task, setTask] = useState();
    const [fileUploading, setFileUploading] = useState();
    const [deadline, setDeadline] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [modalTaskDelivered, setModalTaskDelivered] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [commentAddedOrDeleted, setCommentAddedOrDeleted] = useState(false);
    const [checked, setChecked] = useState(false);
    const {
        register,
        handleSubmit,
        errors, formState: { isSubmitting }
    } = useForm({ mode: 'onSubmit' });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        errors: errorsEdit,
        formState: { isSubmitting: isSubmittingEdit }
    } = useForm({ mode: 'onSubmit' });

    const {
        register: registerReview,
        handleSubmit: handleSubmitReview,
        errors: errorsReview,
        formState: { isSubmitting: isSubmittingReview },
        setValue: setValueReview,
    } = useForm({ mode: 'onSubmit' });

    const {
        register: registerSendComment,
        handleSubmit: handleSubmitSendComment,
        errors: errorsSendComment,
        formState: { isSubmitting: isSubmittingSendComment },
        setValue: setValueSendComment,
    } = useForm({ mode: 'onSubmit' });

    const {
        register: registerAskForReviewOfATask,
        handleSubmit: handleSubmitAskForReviewOfATask,
        errors: errorsAskForReviewOfATask,
        formState: { isSubmitting: isSubmittingAskForReviewOfATask },
        setValue: setValueAskForReviewOfATask,
    } = useForm({ mode: 'onSubmit' });



    let modalMessage = useRef('')

    const history = useHistory();
    const { id, taskId, projectId } = useParams();

    let commentHandled = useRef();
    let commentTextToEdit = useRef();
    let userId = useRef();
    userId.current = localStorage.getItem('reg')
    console.log('id', userId.current)

    let breadcrumb = [
        { bread: 'Meus Projetos', link: '/professor/projetos' },
        { bread: 'Projeto', link: `/professor/projetos/${projectId}` },
        { bread: 'Tarefas', link: `/professor/projetos/${projectId}/tarefas` },
        { bread: task && task.title, link: `` },
    ];

    useEffect(() => {
        api.get(`/tarefa/${taskId}/`)
            .then(({ data: { docs } }) => {
                console.log('Task info', docs[0]);
                setDeadline(new Date(docs[0].deadLine));
                setValueAskForReviewOfATask('customRegisterDeadline', utcToZonedTime(new Date(docs[0].deadLine)), { shouldValidate: true });
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
    }, [commentAddedOrDeleted, modalTaskDelivered]);

    const onSubmit = ({ comment }, e) => {

        api.post('/comentario/criar_comentario', {
            taskId,
            comment,
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

    const handleCheckboxChange = event => {
        console.debug('CHECKED', checked)
        console.debug('TARGET CHECKED', event.target.checked)
        setChecked(event.target.checked)
    }

    useEffect(() => {
        // creating custom registers
        registerAskForReviewOfATask('customRegisterDeadline', { required: true })
    }, [registerAskForReviewOfATask]);

    const handleChangeDeadline = e => {
        console.log('e', e)
        setDeadline(e); // setting value in the state. necessary for update display of the input initialDate
        setValueAskForReviewOfATask('customRegisterDeadline', e, { shouldValidate: true }); // setting value in the custom register
    }

    const evaluateTask = (situation, deadline) => {
        console.debug('data', format(new Date(deadline), 'dd/MM/yyyy'));
        api.patch(`/tarefas/revisar_tarefa/professor/${taskId}`, {
            situation,
            deadLine: format(new Date(deadline), 'dd/MM/yyyy'),
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Tarefa avaliada com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify();
                setModalTaskDelivered(false);
                setTimeout(() => {
                    history.push(`/professor/projetos/${id}/tarefas/${taskId}`)
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setErrorMessage('Erro ao avaliar tarefa. Tente novamente.')
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), 2000);
                });

            });
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1500);
        });
    }

    const onSubmitAskForReviewOfATask = ({ comment, customRegisterDeadline }) => {
        console.debug("DEADLINE", customRegisterDeadline);
        api.patch(`/tarefas/revisar_tarefa/professor/${taskId}`, {
            situation: 'em revisão',
            comment,
            deadLine: convertZonedTimeToUTC(customRegisterDeadline),
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Tarefa avaliada com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify();
                setModalTaskDelivered(false);
                setTimeout(() => {
                    history.push(`/professor/projetos/${id}/tarefas/${taskId}`)
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                    setErrorMessage('Erro ao avaliar tarefa. Tente novamente.')
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), 2000);
                });

            });
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1500);
        });
    }

    return (
        <DashboardUI screenName={task && task.title} itemActive="Meus Projetos" isProfessorActivity={true} breadcrumb={breadcrumb}>
            <TaskHeader>
                {task &&
                    <>
                        <TaskDescription>
                            {task && task.description}
                        </TaskDescription>
                        <TaskDeadline>Prazo de entrega: {task && convertUTCToZonedTime(task.deadLine)}</TaskDeadline>
                        {console.log(task && addHours(new Date(task.deadLine), 3))}
                        <TaskSituation>{task && verifyTaskSituation(task.situation, task.deadLine)}</TaskSituation>
                        {task && (task.finalFile.url || task.link) &&
                            <Button type='button'
                                width='150px'
                                onClick={() => setModalTaskDelivered(true)}>
                                Ver entrega
                            </Button>
                        }

                    </>
                }

            </TaskHeader>
            <TaskCommentBox>
                <form onSubmit={handleSubmitSendComment(onSubmit)}>
                    <textarea
                        name='comment'
                        ref={registerSendComment({
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
                        <Button>Editar
                        </Button>
                        <Button type='button' onClick={() => setModalEditIsOpen(false)}>Cancelar</Button>
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
            <Modal
                open={modalTaskDelivered}
                onClose={() => setModalTaskDelivered(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}
            >
                <h1>Ver entrega</h1>
                <AttachmentRow
                    href={task && ((task.finalFile.url && task.finalFile.url) || (task.link && task.link))}
                    target="_blank"
                    rel="noopener"
                >
                    <TaskAttachmentIcon>
                        <HiOutlineLink />
                    </TaskAttachmentIcon>
                    Link da tarefa
                </AttachmentRow>
                {/* ver entrega */}
                {task && task.situation !== 'concluído' &&
                    <>
                        <Label style={{ fontSize: '1.1rem' }}>
                            <Checkbox
                                name='requestCorrection'
                                checked={checked}
                                onChange={e => handleCheckboxChange(e)}

                            />
                            <span style={{ marginLeft: 8, cursor: 'pointer' }}>Pedir revisão</span>
                        </Label>
                        {checked &&
                            <>
                                <form onSubmit={handleSubmitAskForReviewOfATask(onSubmitAskForReviewOfATask)}>
                                    <Label style={{ display: 'block', marginTop: '7px' }} htmlFor='deadline'>Alterar data de entrega</Label>
                                    <StyledDatePicker
                                        value={deadline}
                                        onChange={value => handleChangeDeadline(value)}
                                        locale='pt-BR'
                                        timeIntervals={15}
                                        error={errorsAskForReviewOfATask.customRegisterDeadline}
                                        placeholder="Nova data de entrega"
                                        style={{ borderColor: errorsAskForReviewOfATask.customRegisterDeadline && light.color.secondary }}
                                    />

                                    {errorsAskForReviewOfATask.customRegisterDeadline &&
                                        <ErrorMessage left marginTop marginBottom>
                                            O prazo de entrega é obrigatório
                                        </ErrorMessage>
                                    }


                                    <Label style={{ display: 'block', marginBottom: '0' }} htmlFor='deadline'>Comentário</Label>
                                    <TaskCommentBox style={{ marginTop: '0' }}>

                                        <textarea
                                            name='comment'
                                            ref={registerAskForReviewOfATask({
                                                required: true,
                                            })}
                                            rows={4}
                                            placeholder='Digite o seu comentário...'
                                            style={errorsAskForReviewOfATask.comment && { borderColor: lightTheme.color.secondary }}

                                        />
                                        {errorsAskForReviewOfATask.comment && errorsAskForReviewOfATask.comment.type === 'required' && <ErrorMessage left>Um texto é obrigatório para efetuar um comentário</ErrorMessage>}
                                        <div style={{ display: 'grid', marginTop: '.1rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                                            <Button type='submit' disabled={isSubmitting}>
                                                Pedir revisão
                                        </Button>
                                            <Button onClick={() => setModalTaskDelivered(false)}>Cancelar</Button>
                                        </div>

                                    </TaskCommentBox>
                                </form>
                            </>
                        }


                        {!checked &&
                            <div style={{ display: 'grid', marginTop: '.1rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                                <Button onClick={() => evaluateTask('concluída', task && task.deadLine)}>Aceitar</Button>
                                <Button onClick={() => setModalTaskDelivered(false)}>Cancelar</Button>
                            </div>
                        }
                    </>
                }
            </Modal>
            <ToastContainer style={{ zIndex: '9999999' }} />
        </DashboardUI >

    );
}

export default TarefaProfessor;

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

const TaskCommentBox = styled.div`
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

const AttachmentRow = styled.a`
    display: flex;
    align-items: center;
    color: ${props => props.theme.color.primary};
    cursor: pointer;
    border: 1px solid ${props => props.theme.color.primary};
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 7px;

    &:hover {
        color: ${props => props.theme.color.secondary};
        background-color: ${props => props.theme.color.secondary}01;
        border: 1px solid ${props => props.theme.color.secondary};
    }
`;

const TaskAttachmentIcon = styled.span`
    font-size: 20px;
    transform: translateY(1.5px);
    margin-right: 5px;

    &:hover {
    }
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
