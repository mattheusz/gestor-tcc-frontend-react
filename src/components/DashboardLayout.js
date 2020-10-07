import React, { Fragment, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import lightTheme from '../themes/light'
import HeaderDashboard from './HeaderDashboard';
import Sidebar from './Sidebar';

function DashboardLayout(props) {
    const [activeSidebar, setActiveSidebar] = useState(true);
    return (
        <ThemeProvider theme={lightTheme}>
            <Wrapper>
                <HeaderDashboard />
                <Sidebar />
                <Content>
                    <Main />
                    <Footer />
                </Content>
            </Wrapper>
        </ThemeProvider>
    );
}

export default DashboardLayout;

const Wrapper = styled.div`
    display: fixed;
    width: 100%;
    height: 100vh;
    background-color: white;
`


const Content = styled.div`
    position: fixed;
    width: 100%;
    height: calc(100vh - 60px);
    overflow: auto;
    margin-left: 270px;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
`

const Main = styled.main`
    flex-grow: 1;
    background-color: white;
`

const Footer = styled.footer`
    height: 70px;
    background-color: white;
`
