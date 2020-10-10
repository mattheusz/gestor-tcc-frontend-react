import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Title } from '../../styled';
import lightTheme from '../../themes/light'
import Header from '../Header';
import Sidebar from '../Sidebar';

const UserContext = React.createContext();
export const SidebarContext = React.createContext({
    showSidebar: () => { },
});

const value = {
    userName: 'LocalStorageName',
    userType: 'LocalStorageType'
}


function DashboardUI({ screenName, children }) {

    const [showSidebar, setShowSidebar] = useState(true);

    const valueSidebarContext = {
        showSidebar,
        setShowSidebar: () => {
            setShowSidebar(!showSidebar)
            console.log(showSidebar);
        }
    }

    console.log('showSideBar', showSidebar);

    return (
        <SidebarContext.Provider value={valueSidebarContext}>
            <UserContext.Provider value={value}>
                <ThemeProvider theme={lightTheme}>
                    <Wrapper>
                        <Header />
                        <Sidebar />
                        <Content showSidebar={showSidebar}>
                            <Main >
                                <Title>{screenName}</Title>
                                {children}
                            </Main>
                            <Footer />
                        </Content>
                    </Wrapper>
                </ThemeProvider>
            </UserContext.Provider>
        </SidebarContext.Provider>
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
