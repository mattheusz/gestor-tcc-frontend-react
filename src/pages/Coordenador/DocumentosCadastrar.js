import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import api from '../../api/api'
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Button from '../../components/Button'
import DashboardUI from '../../components/DashboardUI';
import { MdTitle } from 'react-icons/md';

import IconTextField, { Input } from '../../components/IconTextField/IconTextField';
import ErrorMessage from '../../components/Error'
import light from '../../themes/light';
import Label from '../../components/Label/Label';
import { useDropzone } from 'react-dropzone';
import StyledDropzone from '../../components/StyledDropzone/StyledDropzone';


function DocumentosCadastrar() {
    const [errorMessage, setErrorMessage] = useState();
    const { register, handleSubmit, errors, formState: { isSubmitting } }
        = useForm({ mode: 'onSubmit' });
    const [fileUploading, setFileUploading] = useState();

    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles[0]);
        //setFileUploading(acceptedFiles[0].name)
    }, []);


    const history = useHistory()

    const onChangeFile = (e) => {
        console.log(e.target.files[0])
        setFileUploading(e.target.files[0]);
    }

    const onSubmit = async ({ title }) => {
        console.log(title)
        console.log(fileUploading)

        const formData = new FormData();

        formData.append("title", title);
        formData.append("file", fileUploading);

        api.post('documentos/cadastrar_documento', formData, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            }
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("Documento cadastrado com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push('/documentos')
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response;
                    console.log(msg);
                    setErrorMessage(msg)
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }

            });
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1500);
        });
    }

    return (
        <DashboardUI screenName='Cadastrar Documento' itemActive="Documentos">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='title'>Título</Label>
                <IconTextField>
                    <MdTitle />
                    <Input
                        id='title'
                        name='title'
                        ref={register({
                            required: true
                        })}
                        placeholder='Título'
                        autoFocus
                        style={{ borderColor: errors.fullName && light.color.secondary }}
                    />
                </IconTextField>
                {errors.title &&
                    <ErrorMessage left marginTop marginBottom>
                        O título é obrigatório
                    </ErrorMessage>
                }

                <StyledDropzone
                    accept='.pdf'
                    multiple={false}
                    maxSize={2097152}
                    text="Arraste ou clique para adicionar o documento desejado."
                    setFileUploading={setFileUploading}
                />

                {errorMessage &&
                    <ErrorMessage left style={{ marginTop: '4px', marginBottom: '7px' }}>
                        {errorMessage.data}
                    </ErrorMessage>
                }
                <Button new={true} type='submit' width='100px' disabled={isSubmitting}>
                    Salvar
                </Button>
                &nbsp;
                <Button
                    new={true}
                    type='button'
                    width='100px'
                    onClick={() => history.replace('/documentos')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />
        </DashboardUI>
    );
}

export default DocumentosCadastrar;