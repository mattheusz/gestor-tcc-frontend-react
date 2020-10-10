import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import lightTheme from '../../themes/light'
import Header from '../Header';
import Sidebar from '../Sidebar';
import ViewTitle from '../ViewTitle';


function DashboardUI({ screenName, children }) {

    const [showSidebar, setShowSidebar] = useState(true);


    return (
        <ThemeProvider theme={lightTheme}>
            <Wrapper>
                <Header setShowSidebar={
                    () => setShowSidebar(!showSidebar)
                }

                />
                <Sidebar showSidebar={showSidebar} />
                <Content showSidebar={showSidebar}>
                    <Main >
                        <ViewTitle>{screenName}</ViewTitle>
                        {children}
                    </Main>
                    <Footer />
                </Content>
            </Wrapper>
        </ThemeProvider>
    );
}

export default DashboardUI;

const Wrapper = styled.div`
    display: fixed;
    width: 100%;
    height: 100vh;
    background-color: white;
`


const Content = styled.div`
    position: fixed;
    width: 100%;
    width: ${props => props.showSidebar ? 'calc(100% - 256px)' : '100%'};
    height: calc(100vh - 60px);
    overflow: auto;
    margin-left: ${props => props.showSidebar ? '256px' : 0};
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    transition: margin-left .3s;
`

const Main = styled.main`
    flex-grow: 1;
    background-color: white;
    padding: 1rem 1.5rem;
    max-width: 100%
`

const Footer = styled.footer`
    height: 70px;
    background-color: white;
`
