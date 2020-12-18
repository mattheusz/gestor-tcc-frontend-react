import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import StyledDropzone from '../../components/StyledDropzone/StyledDropzone';
import { device } from '../../device';

function AtividadeProfessor(props) {

    const [fileUploading, setFileUploading] = useState();
    const { register, handleSubmit, errors, formState: { isSubmitting } }
        = useForm({ mode: 'onSubmit' });

    const onSubmit = async ({ title: comment }) => {
        console.log(comment)
        console.log(fileUploading)

        return;

        const formData = new FormData();

        formData.append("title", comment);
        formData.append("file", fileUploading);


    }

    return (
        <DashboardUI screenName='Atividade 1' itemActive="Meus Projetos">
            <ActivityHeader>
                <ActivityDescription>
                    Uma boa introdução possui inúmeros fatores importantes, como tamanho
                    de 10 a 14 parágrafos e conter todos os elementos essenciais do projeto
                    de pesquisa, como tema, pergunta problema, justificativa, dentre outros.
                </ActivityDescription>
                <ActivitySituation>em andamento</ActivitySituation>
            </ActivityHeader>
            <ActivityCommentBox>
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
                    <Button new={true} type='submit' width='100px'>
                        Comentar
                </Button>
                </form>

            </ActivityCommentBox>
            <ActivityCommentList>
                <ActivityCommentListItem>
                    <ActivityCommentDate>
                        15 de Outubro de 2021 às 15:15
                    </ActivityCommentDate>
                    <div>
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
                            Matheus Justino
                        </ActivityCommentAuthor>
                    </div>
                    <ActivityCommentText>Este é um comentário referente as boas vindas. Bom trabalho!</ActivityCommentText>
                    <div>
                        <ActivityCommentAttachment>Anexo: </ActivityCommentAttachment>
                    </div>
                </ActivityCommentListItem>
                <ActivityCommentListItem>
                    <ActivityCommentDate>
                        15 de Outubro de 2021 às 15:15
                    </ActivityCommentDate>
                    <div>
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
                            Matheus Justino
                        </ActivityCommentAuthor>
                    </div>
                    <ActivityCommentText>Este é um comentário referente as boas vindas. Bom trabalho!</ActivityCommentText>
                </ActivityCommentListItem>
            </ActivityCommentList>
        </DashboardUI>

    );
}

export default AtividadeProfessor;

const ActivityHeader = styled.div`
    border-bottom: 1px solid ${props => props.theme.color.grey}55;
`;

const ActivityDescription = styled.div`
    padding: 1rem 0 1rem;
    border-top: 1px solid ${props => props.theme.color.grey}55;
    color: ${props => props.theme.color.dark};
`;

const ActivitySituation = styled.span`
    display: inline-block;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.primary};
    padding: 5px;
    color: ${props => props.theme.color.primary};
    font-size: 1rem;

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
    }
`;

const ActivityCommentBox = styled.div`
    border: 1px solid ${props => props.theme.color.grey}55;
    background: ${props => props.theme.color.grey}55;
    border-radius: 5px;
    margin-top: 1.2rem;
    padding: 1.2rem;

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

const ActivityCommentDate = styled.p`
    color: ${props => props.theme.color.dark};
    margin-bottom: 7px;
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


