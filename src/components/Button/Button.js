import styled from "styled-components";
import { device } from "../../device";

const Button = styled.button`
    color: white;
    background-color: ${props => props.theme.color.secondary};
    border: none;
    border-radius: ${props => props.new ? '1px' : '3px'};
    width: 100%;
    padding: .5rem 1rem;
    height: 2.5rem;
    font-size: 1rem;
    cursor: pointer;
    margin-top: .5rem;
    outline: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &:hover{
    background-color: ${props => props.theme.color.secondaryShadow}
    }

    &:disabled{
    background-color: ${props => props.theme.color.secondaryLight}
    }

    svg {
        width: 20px;
        height: auto;
    }

    @media ${device.mobileL}{
        width: ${props => props.width ? props.width : '100%'};
        margin-top: ${props => props.new ? '0' : '.7rem'};;
        margin-left: 0;
    }

    @media ${device.laptop}{
        width: ${props => props.width ? props.width : '100%'};
        margin-top: ${props => props.new ? '0' : '.7rem'};;
        margin-left: 0;
    }

`

export default Button;