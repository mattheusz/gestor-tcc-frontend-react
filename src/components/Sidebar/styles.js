import styled from 'styled-components';
import { device } from '../../device';

export const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: ${props => props.showSidebar ? '-257px' : 0};
    width: 256px;
    height: 100vh;
    overflow-y: auto;
    margin-top: 60px;
    background-color: #FEFEFE;
    transition: left .3s;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: .5px 0 3px rgba(0, 0, 0, 0.1);
    z-index: 0;
    /*z-index: 1;*/

    @media ${device.mobileS} {
        
    }

    @media ${device.mobileL} {
        
    }

    @media ${device.tablet}{
        left: ${props => props.showSidebar ? 0 : '-257px'};
    }
`