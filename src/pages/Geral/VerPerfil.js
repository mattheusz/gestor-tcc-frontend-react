import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Button from '../../components/Button';
import DashboardUI from '../../components/DashboardUI';
import { device } from '../../device';
import lightTheme from '../../themes/light'

function VerPerfil(props) {
    return (
        <DashboardUI screenName='' itemActive="">
            <Container>
                <h2>Perfil</h2>
                <ProfileGrid>
                    <GridItem>Nome</GridItem>
                    <GridItem>Matheus Silva Justino</GridItem>
                    <GridItem>Matrícula</GridItem>
                    <GridItem>201619700077</GridItem>
                    <GridItem>E-mail</GridItem>
                    <GridItem>matheussjusttino@gmail.com</GridItem>
                </ProfileGrid>

                <Button width='205px' new> Editar perfil</Button>
            </Container>
        </DashboardUI>
    );
}

export default VerPerfil;

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

    h2{
        margin-left: 10px;
    }
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