import React, { useContext, useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import Cropper from 'react-easy-crop';
import { useHistory } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Modal } from 'react-responsive-modal';
import { FaLock } from "react-icons/fa";
import api from '../../api/api';
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import { device } from '../../device';
import lightTheme from '../../themes/light'
import { toast } from 'react-toastify';
import getCroppedImg from '../../utils/cropImage'
import { dataURLtoFile } from '../../utils/blobToFile'
import IconTextField, { Input } from '../../components/IconTextField';
import { RiLockPasswordFill } from 'react-icons/ri'
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../components/Error/ErrorMessage';
import Label from '../../components/Label/Label';
import { InputGroup } from '../../styled';
import { AuthContext } from '../../context/AuthContext';

function VerPerfil() {
    // crop image states
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState();
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [updateImage, setUpdateImage] = useState(false);
    const [modalChangePasswordIsOpen, setModalChangePasswordIsOpen] = useState(false);

    const [userInfo, setUserInfo] = useState();
    const history = useHistory();

    const inputRef = useRef();
    const triggerFileSelectPopup = () => inputRef.current.click();
    let userId = useRef();
    userId.current = localStorage.getItem('reg');

    const { register, handleSubmit, errors, watch } = useForm({ mode: 'onSubmit' });

    const watchPassword = watch('newPassword');
    const { logout } = useContext(AuthContext);

    let breadcrumb = [
        { bread: 'Perfil', link: '/perfil' }
    ];

    useEffect(() => {
        api.get(`usuarios/perfil/${userId.current}`)
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
    }, [updateImage]);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const onSelectFile = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.addEventListener("load", () => {
                setImage(reader.result);
            });
        }
    };

    const clearInputFile = () => {
        setImage(null);
        inputRef.current.value = "";
    }

    function blobToFile(theBlob, fileName) {
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    const onSubmit = async () => {

        const croppedImage = await getCroppedImg(
            image,
            croppedArea,
        )
        console.log('donee', { croppedImage });
        setCroppedImage(croppedImage)
        //let file = dataURLtoFile(croppedImage, 'file');
        console.log('donee', { croppedImage });

        const formData = new FormData();
        let file;
        let teste;


        const response = await fetch(`${croppedImage}`)/*
            .then(response => {
                console.log('file', response.blob());
                file = new File([response], "fileName.jpeg", { type: 'image/jpeg' });
            })
            ;
*/
        //console.log('BLOB DO FETCH', response.blob())

        // a resposta só pode ser chamada uma vez
        file = blobToFile(await response.blob(), 'fileName');
        console.log('file', file)
        formData.append("file", file)


        api.patch(`/usuarios/atualizar_perfil/foto/${userId.current}`, formData, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            }
        })
            .then(response => {
                console.log(response.data);
                toast.success("A sua foto de perfil atualizada com sucesso", {
                    autoClose: 2000,
                });
                clearInputFile();
                setUpdateImage(!updateImage);
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

    const onSubmitChangePassword = ({ currentPassword, newPassword, confirmPassword }) => {
        console.debug(currentPassword, newPassword, confirmPassword);
        api.patch(`/usuario/trocar_senha/${userId.current}`, {
            currentPassword,
            newPassword,
            confirmPassword,
        })
            .then(response => {
                console.log(response);
                toast.success("A sua senha foi alterada com sucesso", {
                    autoClose: 2000,
                });
                setModalChangePasswordIsOpen(false);

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
    }

    const openEditPerfil = () => {
        history.push(`/perfil/${userId.current}/editar`)
    }

    return (
        <DashboardUI screenName='' itemActive="" breadcrumb={breadcrumb}>
            <Container>
                <ProfileTitle>Perfil</ProfileTitle>
                <AvatarContainer>
                    <Avatar
                        round
                        color={lightTheme.color.primary}
                        size='5.5rem'
                        textSizeRatio={1.5}
                        name={localStorage.getItem('username')}
                        src={userInfo && userInfo.profilePicture && userInfo.profilePicture.url}
                        style={{
                            cursor: 'pointer',
                        }} />

                    <ProfileButtonContainer>
                        <input
                            type='file'
                            accept='image/*'
                            ref={inputRef}
                            onChange={onSelectFile}
                            style={{ display: "none" }}
                        />
                        <ProfileButton
                            onClick={triggerFileSelectPopup}
                        >
                            Editar foto
                        </ProfileButton>
                    </ProfileButtonContainer>
                </AvatarContainer>
                <ProfileGrid>
                    {userInfo ?
                        <>
                            {
                                userInfo.name &&
                                <>
                                    <GridItem>Nome</GridItem>
                                    <GridItem>{userInfo.name}</GridItem>
                                </>
                            }
                            {
                                userInfo.registration &&
                                <>
                                    <GridItem>Matrícula</GridItem>
                                    <GridItem>{userInfo.registration}</GridItem>
                                </>
                            }
                            {
                                userInfo.email &&
                                <>
                                    <GridItem>E-mail</GridItem>
                                    <GridItem>{userInfo.email}</GridItem>
                                </>
                            }
                            {
                                userInfo.secondaryEmail &&
                                <>
                                    <GridItem>E-mail secundário</GridItem>
                                    <GridItem>{userInfo.secondaryEmail}</GridItem>
                                </>
                            }
                            {
                                userInfo.researchLine &&
                                <>
                                    <GridItem>Linha de pesquisa</GridItem>
                                    <GridItem>{userInfo.researchLine}</GridItem>
                                </>
                            }
                            {
                                userInfo.aboutProfile &&
                                <>
                                    <GridItem>Sobre</GridItem>
                                    <GridItem>{userInfo.aboutProfile}</GridItem>
                                </>
                            }
                            {
                                userInfo.links ?
                                    <>
                                        {
                                            userInfo.links.lattes &&
                                            <>
                                                <GridItem>Lattes</GridItem>
                                                <GridItem>{userInfo.links.lattes && userInfo.links.lattes}</GridItem>
                                            </>
                                        }
                                        {
                                            userInfo.links.linkedin &&
                                            <>
                                                <GridItem>Linkedin</GridItem>
                                                <GridItem>{userInfo.links.linkedin && userInfo.links.linkedin}</GridItem>
                                            </>
                                        }
                                        {
                                            userInfo.links.youtube &&
                                            <>
                                                <GridItem>Youtube</GridItem>
                                                <GridItem>{userInfo.links.youtube && userInfo.links.youtube}</GridItem>
                                            </>
                                        }
                                        {
                                            userInfo.links.facebook &&
                                            <>
                                                <GridItem>Facebook</GridItem>
                                                <GridItem>{userInfo.links.facebook && userInfo.links.facebook}</GridItem>
                                            </>
                                        }
                                        {
                                            userInfo.links.instagram &&
                                            <>
                                                <GridItem>Instagram</GridItem>
                                                <GridItem>{userInfo.links.instagram && userInfo.links.instagram}</GridItem>
                                            </>
                                        }
                                    </>
                                    : ''

                            }


                        </> : ''
                    }


                </ProfileGrid>

                <ButtonContainer >
                    <Button primary onClick={() => openEditPerfil()} width='205px' new> Editar perfil</Button>
                    <Button primary onClick={() => setModalChangePasswordIsOpen(true)} width='205px' new> Mudar senha</Button>
                    <Button noDesktop onClick={() => logout()} width='205px' new >Sair</Button>
                </ButtonContainer>
            </Container>
            {image ? (
                <ContainerCropper>

                    <>
                        <CropperDiv>
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </CropperDiv>

                        <div className='slider'>
                            <Slider
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e, zoom) => setZoom(zoom)}
                            />
                        </div>
                        <CropButtonsContainer>
                            <CropButton save={true}
                                onClick={() => onSubmit()}
                            >
                                Salvar</CropButton>
                            <CropButton
                                onClick={() => clearInputFile()}
                            >
                                Cancelar
                            </CropButton>
                        </CropButtonsContainer>
                    </>

                </ContainerCropper>

            ) : null}
            {/* change password */}
            <Modal
                open={modalChangePasswordIsOpen}
                onClose={() => setModalChangePasswordIsOpen(false)}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}

            >
                <form onSubmit={handleSubmit(onSubmitChangePassword)}>
                    <h1>Mudança de senha</h1>
                    <Label htmlFor='currentPassword'>Senha atual</Label>
                    <IconTextField>
                        <FaLock />
                        <Input
                            type='password'
                            name='currentPassword'
                            ref={register({
                                required: true,
                                minLength: 8
                            })}
                            placeholder='Senha atual'
                            style={errors.currentPassword && { borderColor: lightTheme.color.secondary }}
                        />
                    </IconTextField>
                    {errors.currentPassword && errors.currentPassword.type === 'required' && <ErrorMessage left>A senha atual é obrigatória</ErrorMessage>}
                    {errors.currentPassword && errors.currentPassword.type === 'minLength' && <ErrorMessage left>A senha atual deve conter no mínimo 8 caracteres</ErrorMessage>}

                    <Label htmlFor='newPassword'>Nova senha</Label>
                    <IconTextField>
                        <FaLock />
                        <Input
                            type='password'
                            name='newPassword'
                            ref={register({
                                required: true,
                                minLength: 8
                            })}
                            placeholder='Nova senha'
                            style={errors.newPassword && { borderColor: lightTheme.color.secondary }}
                        />
                    </IconTextField>
                    {errors.newPassword && errors.newPassword.type === 'required' && <ErrorMessage left>A nova senha é obrigatória</ErrorMessage>}
                    {errors.newPassword && errors.newPassword.type === 'minLength' && <ErrorMessage left>A nova senha deve conter no mínimo 8 caracteres</ErrorMessage>}

                    <Label htmlFor='confirmPassword'>Confirmar nova senha</Label>
                    <InputGroup>
                        <RiLockPasswordFill />
                        <Input
                            name='confirmPassword'
                            id='password'
                            type='password'
                            placeholder='Confirmar Nova Senha'
                            ref={register({
                                required: true,
                                validate: (value) => value === watchPassword
                            })}
                            style={errors.confirmPassword && { borderColor: lightTheme.color.secondary }}

                        />
                    </InputGroup>
                    {errors.confirmPassword && errors.confirmPassword.type === 'required' && <ErrorMessage left>A confirmação de senha deve preenchida</ErrorMessage>}
                    {errors.confirmPassword && errors.confirmPassword.type === 'validate' && <ErrorMessage left>As senhas digitadas não conferem </ErrorMessage>}


                    <div style={{ display: 'grid', marginTop: '.1rem', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                        <Button >Salvar</Button>
                        <Button onClick={() => setModalChangePasswordIsOpen(false)}>Cancelar</Button>
                    </div>
                </form>
            </Modal>
        </DashboardUI>
    );
}

export default VerPerfil;

//remover depois que pegar slider do material ui
const Slider = styled.div`

`

const Container = styled.div`
    width: 100%;
    @media ${device.mobileS}{
        width: 100%;
    }   
 
    @media ${device.tablet}{
        max-width: 887px;
        margin: 0 auto;
        border-radius: 5px;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
`
const ProfileTitle = styled.h2`
    text-align: center;
`
const AvatarContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const ProfileButtonContainer = styled.div`

`
const ProfileButton = styled.button`
    width: auto;
    padding: .2rem .5rem;
    margin-top: .5rem;
    outline: none;
    border: none;
    border-radius: 5px;
    color: ${props => props.theme.color.dark};
    background-color: ${props => props.theme.color.gray}01;
    font-family: "Roboto";
    cursor: pointer
`

const ProfileGrid = styled.div`

    @media ${device.mobileS}{
        margin-bottom: 1rem;
        display: grid;
        grid-template-columns: 1fr;
        width: 100%;
    }   
 
    @media ${device.tablet}{
        grid-template-columns: 1fr 1fr;
        width: 100%;
        margin: 0 auto;
        margin-bottom: 1rem;
    }
`;

const GridItem = styled.div`
    
        padding: .7rem;
        font-size: 1.1rem;
        
        &:nth-child(odd){
            color: grey;
        }

        &:nth-child(even){
            border-bottom: 1px solid #cccd;
        }
    

    @media ${device.tablet}{
        padding: 1rem;
        border-bottom: 1px solid #cccd;
    }    
`;

const ContainerCropper = styled.div`
    position: fixed;
    height: 90%;
    width: 100%;
    top:0;
    left: 0;
    z-index: 1000;
	padding: 00;
`;

const CropperDiv = styled.div`
    height: 90%;
    position: relative;
    z-index: 999;
`;

const CropButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: #fff;
    height: 100%;
`;

const CropButton = styled.div`
    width: auto;
    padding: .4rem .5rem;
    margin-top: .5rem;
    margin-right: .5rem;
    outline: none;
    border: none;
    border-radius: 5px;
    color: white;
    background-color: ${props => props.save ? props.theme.color.primary : props.theme.color.secondary};
    font-family: Roboto;
    word-spacing: 2px;
    cursor: pointer
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media ${device.tablet}{
        padding: 1rem;
        border-bottom: 1px solid #cccd;
        flex-direction: row;
    }    

`