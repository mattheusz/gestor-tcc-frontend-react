import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import lightTheme from '../themes/light'
import HeaderDashboard from './HeaderDashboard';
import Sidebar from './Sidebar';

const UserContext = React.createContext();
export const SidebarContext = React.createContext({
    showSidebar: () => { },
});

const value = {
    userName: 'LocalStorageName',
    userType: 'LocalStorageType'
}


function DashboardLayout(props) {

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
                        <HeaderDashboard />
                        <Sidebar />
                        <Content>
                            <Main />
                            <Footer />
                        </Content>
                    </Wrapper>
                </ThemeProvider>
            </UserContext.Provider>
        </SidebarContext.Provider>
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
