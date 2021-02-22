import React, { useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import Cropper from 'react-easy-crop';
import { useHistory } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Modal } from 'react-responsive-modal';
import api from '../../api/api';
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import { device } from '../../device';
import lightTheme from '../../themes/light'
import { toast } from 'react-toastify';
import getCroppedImg from '../../utils/cropImage'
import { dataURLtoFile } from '../../utils/blobToFile'

function VerPerfil() {
    // crop image states
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState();
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [userInfo, setUserInfo] = useState();
    const history = useHistory();

    const inputRef = useRef();
    const triggerFileSelectPopup = () => inputRef.current.click();
    let userId = useRef();
    userId.current = localStorage.getItem('reg');

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
    }, []);

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


    const openEditPerfil = () => {
        history.push(`/perfil/${userId.current}/editar`)
    }

    return (
        <DashboardUI screenName='' itemActive="">
            <Container>
                <ProfileTitle>Perfil</ProfileTitle>
                <AvatarContainer>
                    <Avatar
                        round
                        color={lightTheme.color.primary}
                        size='5.5rem'
                        textSizeRatio={1.5}
                        name='Matheus Justino'
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

                <Button onClick={() => openEditPerfil()} width='205px' new> Editar perfil</Button>
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
                            <CropButton
                                onClick={() => onSubmit()}
                                onMouseUp={() => onSubmit()}
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
    z-index: 999;
	padding: 5px 0;
`;

const CropperDiv = styled.div`
    height: 90%;
    position: relative;
    z-index: 999;
`;

const CropButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    
`;

const CropButton = styled.div`
    width: auto;
    padding: .2rem .5rem;
    margin-top: .5rem;
    margin-right: .5rem;
    outline: none;
    border: none;
    border-radius: 5px;
    color: ${props => props.theme.color.light};
    background-color: ${props => props.theme.color.primary};
    font-family: "Roboto";
    cursor: pointer
`;