import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi'
import { device } from '../../device';

const Hamburguer = styled(FiMenu)`
    position: absolute;
    right: 20px;
    color: ${props => props.theme.color.primary};
    font-size: 1.6rem;
    cursor: pointer;
    transition: all .3s;

    &:hover{
        color: ${props => props.theme.color.secondary};
        font-weight: 400;
    }


    @media ${device.tablet}{
        left: 208px;
    }
`
export default Hamburguer