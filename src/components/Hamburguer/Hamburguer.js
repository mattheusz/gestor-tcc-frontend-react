import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi'

const Hamburguer = styled(FiMenu)`
    position: absolute;
    left: 208px;
    color: ${props => props.theme.color.primary};
    font-size: 1.6rem;
    cursor: pointer;
    transition: all .3s;

    &:hover{
        color: ${props => props.theme.color.secondary};
        font-weight: 400;
    }
`
export default Hamburguer