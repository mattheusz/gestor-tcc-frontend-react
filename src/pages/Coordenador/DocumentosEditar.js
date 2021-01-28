import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
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
import Checkbox from '../../components/Checkbox';


function DocumentosEditar() {
    const [errorMessage, setErrorMessage] = useState();
    const [fileUploading, setFileUploading] = useState();
    const [checkedUpdateDocument, setCheckedUpdateDocument] = useState();
    const [submitedWithSucess, setSubmitedWithSucess] = useState(false);

    const { register, handleSubmit, errors, formState: { isSubmitting }, watch, setValue }
        = useForm({ mode: 'onSubmit' });

    const watchUpdateDocumentFileCheck = watch('updateDocumentFileCheck');

    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles[0]);
        //setFileUploading(acceptedFiles[0].name)
    }, []);


    const history = useHistory()
    const { documentId, documentTitle } = useParams();

    useEffect(() => {
        register("file", { required: checkedUpdateDocument ? true : false });
    }, [register, checkedUpdateDocument])


    const onSubmit = async ({ title, file }) => {
        console.log(title)

        const formData = new FormData();

        formData.append("title", title);
        file && formData.append("file", file);
        console.debug('BOUNDARY', formData._boundary)

        api.patch(`documentos/atualizar_documento/${documentId}`, formData, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            }
        })
            .then(response => {
                console.log(response.data);
                setSubmitedWithSucess(true);
                const notify = () =>
                    toast.success("Documento atualizado com sucesso", {
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

    const handleUpdateDocumentCheckbox = (e) => {
        setCheckedUpdateDocument(e.target.checked)
        if (!e.target.checked) setValue('file', '')
    }

    return (
        <DashboardUI screenName='Editar Documento' itemActive="Documentos">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
                <Label htmlFor='title'>Título</Label>
                <IconTextField>
                    <MdTitle />
                    <Input
                        id='title'
                        name='title'
                        defaultValue={documentTitle}
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

                <Label style={{ fontSize: '1.1rem', display: 'block' }}>
                    <Checkbox
                        marked={watchUpdateDocumentFileCheck}
                        name='updateDocumentFileCheck'
                        register={register}
                    />
                    <span style={{ marginLeft: 8, cursor: 'pointer' }}>Inserir novo documento</span>
                </Label>

                {watchUpdateDocumentFileCheck &&
                    <>
                        <StyledDropzone
                            accept='.pdf'
                            multiple={false}
                            maxSize={2097152}
                            text="Arraste ou clique para adicionar o documento desejado."
                            setFileUploading={setFileUploading}
                            setValue={setValue}
                        />

                        {errors.file &&
                            <ErrorMessage left marginTop marginBottom style={{ marginTop: '-4px', marginBottom: '7px' }}>
                                Um documento em PDF é obrigatório.
                            </ErrorMessage>
                        }
                    </>
                }


                <Button new={true} type='submit' width='100px' disabled={isSubmitting || submitedWithSucess || false}>
                    Salvar
                </Button>
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

export default DocumentosEditar;