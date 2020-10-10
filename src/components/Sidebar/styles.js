import styled from 'styled-components';

export const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: ${props => props.showSidebar ? 0 : '-257px'};
    width: 256px;
    height: 100vh;
    overflow-y: auto;
    margin-top: 60px;
    background-color: #FEFEFE;
    transition: left .3s;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: .5px 0 3px rgba(0, 0, 0, 0.1);
    z-index: 1;
`