import React, { useCallback, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import lightTheme from '../../themes/light'
import Header from '../Header';
import Sidebar from '../Sidebar';
import ViewTitle from '../ViewTitle';
import { device } from '../../device';
import DropdownUserAccount from '../DropdownUserAccount/DropdownUserAccount';


function DashboardUI({ screenName, itemActive, children }) {

    const [showSidebar, setShowSidebar] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggle = useCallback(() => {
        setShowSidebar(!showSidebar)
    }, [showSidebar])

    const toggleDropdown = useCallback(() => {
        setShowDropdown(!showDropdown);
        console.log('toggle dropdown', showDropdown)
    }, [showDropdown])

    return (
        <ThemeProvider theme={lightTheme}>
            <Wrapper>
                <Header
                    setShowSidebar={toggle}
                    setShowDropdown={toggleDropdown}
                />
                <Sidebar showSidebar={showSidebar} itemActive={itemActive} />
                <Content showSidebar={showSidebar}>
                    <Main >
                        <MainCard>
                            <ViewTitle>{screenName}</ViewTitle>
                            {children}
                        </MainCard>
                    </Main>
                    <Footer />
                </Content>
                <DropdownUserAccount
                    showDropdown={showDropdown}
                />
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
    position: relative;
`


const Content = styled.div`
    position: fixed;
    width: 100%;
    /*width: ${props => props.showSidebar ? '100%' : 'calc(100% - 256px)'};*/
    margin-left: 0;
    height: calc(100vh - 60px);
    overflow: auto;
    
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    transition: margin-left .3s;
    z-index: 0;

    @media ${device.mobileM}{
        /*width: ${props => props.showSidebar ? '100%' : 'calc(100% - 256px)'};*/
        margin-left: 0;
    }

    @media ${device.tablet}{
        width: ${props => props.showSidebar ? 'calc(100% - 256px)' : '100%'};
        margin-left: ${props => props.showSidebar ? '256px' : 0};
    }

    
`

const Main = styled.main`
    flex-grow: 1;
    background-color: white;
    padding: 1rem 1rem 1rem 1.5rem;
    max-width: 100%;
    z-index: 1;
    
`
const MainCard = styled.div`
    border: 1px solid ${props => props.theme.color.grey}55;
    box-shadow: 3px 3px 3px ${props => props.theme.color.primary}15;
    padding: 1rem;
    border-radius 5px;
    max-width: 1050px;
    margin: 0 auto;
    position: relative;
`;

const Footer = styled.footer`
    height: 70px;
    background-color: white;
`
