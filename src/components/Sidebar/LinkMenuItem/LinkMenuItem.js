import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { device } from '../../../device';

const LinkMenuItem = styled(Link)`
    display: block;
    padding: .6rem .3rem .6rem 1.7rem;
    font-weight: ${props => props.active ? '400' : 'inherit'};
    color: ${props => props.active ? 'white' : props.theme.color.dark};
    position: relative;
    transition: background-color .1s;

    svg{
        width: 20px;
        height: auto;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    span{
        padding-left: 30px;
        z-index: 5;
    }

    ::before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -21;
            border-radius: 0 25px 25px 0;
            background-color: ${props => props.active ? props.theme.color.secondaryDark : 'white'}
        }

    &:hover{
        color: ${props => props.theme.color.primary};
        font-weight: 400;
        color: white;

        ::before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${props => props.theme.color.secondary};
            z-index: -21;
            border-radius: 0 25px 25px 0;
            
            
        }
    }
`
export default LinkMenuItem;