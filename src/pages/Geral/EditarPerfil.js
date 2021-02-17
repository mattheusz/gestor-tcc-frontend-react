import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaFacebookF, FaInstagram, FaLock, FaUserAlt, FaYoutube } from 'react-icons/fa';
import { TiSocialLinkedin } from 'react-icons/ti';
import { useHistory, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import api from '../../api/api';
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import ErrorMessage from '../../components/Error';
import IconTextField, { Input } from '../../components/IconTextField';
import Label from '../../components/Label/Label';
import light from '../../themes/light';
import Lattes from '../../assets/lattes_gray.svg';
import StyledDropzone from '../../components/StyledDropzone/StyledDropzone';

function EditarPerfil(props) {

    const [userInfo, setUserInfo] = useState();
    const [fileUploading, setFileUploading] = useState();

    const history = useHistory();
    const { userId } = useParams();
    const { register, handleSubmit, errors, setValue } = useForm();

    useEffect(() => {
        api.get(`usuarios/perfil/${userId}`)
            .then(({ data }) => {
                console.debug('User Info', data);
                setUserInfo(data);
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
    }, []);

    const onSubmit = ({ aboutProfile, lattes, linkedin, youtube, facebook, instagram, phoneNumber }) => {
        api.patch(`usuarios/atualizar_perfil/${userId}`, {
            aboutProfile,
            lattes,
            linkedin,
            youtube,
            facebook,
            instagram,
            phoneNumber
        })
            .then(response => {
                console.log(response.data);
                const notify = () =>
                    toast.success("O seu perfil atualizado com sucesso", {
                        autoClose: 2000,
                    }
                    );
                notify()
                setTimeout(() => {
                    history.push('/perfil')
                }, 2000);

            })
            .catch(error => {
                if (error.response) {
                    const msg = error.response.data;
                    console.log(msg);
                }
                if (error.request) {
                    console.log(error.request);
                }
                else {
                    console.log('Error', error.message);
                }

            });
    }

    return (
        <DashboardUI screenName='Editar Perfil' itemActive="">
            <form onSubmit={handleSubmit(onSubmit)} >
                <Label htmlFor='email'>E-mail</Label>
                <IconTextField>
                    <FaEnvelope />
                    <Input
                        id='email'
                        name='email'
                        type='email'
                        defaultValue={userInfo && userInfo.email && userInfo.email}
                        ref={register({
                            required: true
                        })}
                        placeholder='E-mail'
                        style={{ borderColor: errors.email && light.color.secondary }}
                    />
                </IconTextField>
                {errors.email &&
                    <ErrorMessage left style={{ marginTop: '-10px', marginBottom: '3px' }}>
                        O e-mail é obrigatório
                    </ErrorMessage>
                }

                <Label htmlFor='sobre'>Sobre</Label>
                <TextArea
                    name='aboutProfile'
                    ref={register}
                    rows={4}
                    placeholder='Fale sobre você...'
                    defaultValue={userInfo && userInfo.aboutProfile && userInfo.aboutProfile}
                    style={errors.aboutProfile && { borderColor: light.color.secondary }}

                />

                <Label htmlFor='lattes'>Lattes</Label>
                <IconTextField>
                    <img src={Lattes} id='lattes' alt='Lattes' />
                    <Input
                        id='lattes'
                        name='lattes'
                        type='text'
                        ref={register}
                        placeholder='Lattes'
                        defaultValue={userInfo && userInfo.links && userInfo.links.lattes}
                        style={{ borderColor: errors.lattes && light.color.secondary }}
                    />
                </IconTextField>

                <Label htmlFor='linkedin'>Linkedin</Label>
                <IconTextField>
                    <TiSocialLinkedin />
                    <Input
                        id='linkedin'
                        name='linkedin'
                        type='text'
                        ref={register}
                        placeholder='Linkedin'
                        defaultValue={userInfo && userInfo.links && userInfo.links.linkedin}
                        style={{ borderColor: errors.linkedin && light.color.secondary }}
                    />
                </IconTextField>

                <Label htmlFor='youtube'>Youtube</Label>
                <IconTextField>
                    <FaYoutube />
                    <Input
                        id='youtube'
                        name='youtube'
                        type='text'
                        ref={register}
                        placeholder='Youtube'
                        defaultValue={userInfo && userInfo.links && userInfo.links.youtube}
                        style={{ borderColor: errors.youtube && light.color.secondary }}
                    />
                </IconTextField>
                <Label htmlFor='facebook'>Facebook</Label>
                <IconTextField>
                    <FaFacebookF />
                    <Input
                        id='facebook'
                        name='facebook'
                        type='text'
                        ref={register}
                        placeholder='Facebook'
                        defaultValue={userInfo && userInfo.links && userInfo.links.facebook}
                        style={{ borderColor: errors.facebook && light.color.secondary }}
                    />
                </IconTextField>

                <Label htmlFor='instagram'>Instagram</Label>
                <IconTextField>
                    <FaInstagram />
                    <Input
                        id='instagram'
                        name='instagram'
                        type='text'
                        ref={register}
                        placeholder='Instagram'
                        defaultValue={userInfo && userInfo.links && userInfo.links.instagram}
                        style={{ borderColor: errors.instagram && light.color.secondary }}
                    />
                </IconTextField>

                <Label htmlFor='password'>Nova Senha</Label>
                <IconTextField>
                    <FaLock />
                    <Input
                        type='password'
                        name='password'
                        autoComplete='new-password'
                        ref={register({
                        })}
                        placeholder='Senha'
                        style={errors.password && { borderColor: light.color.secondary }}
                    />
                </IconTextField>
                {/*}
                {errors.password && errors.password.type === 'required' && <ErrorMessage left>A senha é obrigatória</ErrorMessage>}
                {errors.password && errors.password.type === 'minLength' && <ErrorMessage left>A senha deve conter no mínimo 8 caracteres</ErrorMessage>}
                */}
                <Button new={true} type='submit' width='100px'>
                    Salvar
                </Button>
                <Button new={true} type='button' width='100px' onClick={() => history.replace('/alunos')}>
                    Cancelar
                </Button>
            </form>
            <ToastContainer style={{ zIndex: '9999999' }} />
        </DashboardUI>
    );
}

export default EditarPerfil;

const TextArea = styled.textarea`
    border: 1px solid #a9a9a9;
    outline: none;
    border-radius: 3px;
    margin-top: .1rem;
    margin-bottom: .5rem;
    padding: .5rem .2rem;
    padding-left: .5rem;
    font-size: 1rem;
    width: 100%;
    resize: none;
`