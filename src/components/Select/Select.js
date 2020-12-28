import styled from 'styled-components';
import { device } from '../../device';

const Select = styled.select`
    height: 2.5rem;
    display: block;
    outline: none;
    border: 1px solid ${props => props.theme.color.grey};
    cursor: pointer;
    margin-top: .5rem;
    margin-bottom: ${props => props.formSelect ? '.7rem' : 0};
    /*padding-left: 1.6rem;*/
    width: 100%;
    border-radius: ${props => props.formSelect ? '3px' : 0};
    transition: all .3s;


    @media ${device.mobileS} {
        max-width: 100%;
    }

    @media ${device.mobileL} {
        /*margin-left: ${props => props.formSelect ? 0 : '.5rem'};
        width: ${props => props.formSelect ? '100%' : '100px'};*/
        
    }

    @media ${device.tablet}{
        width: ${props => props.formSelect ? '100%' : '100px'};
        margin-left: ${props => props.formSelect ? 0 : '.5rem'};
        margin-top: 0;
    }
    
    @media ${device.laptop}{
        width: ${props => props.formSelect ? '100%' : '100px'};
        margin-left: ${props => props.formSelect ? 0 : '.5rem'};
    }

    &:focus {
        outline: 0;
        border-color: ${props => props.theme.color.primary};
    }
`

export default Select;