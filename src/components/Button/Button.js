import styled from "styled-components";
import { device } from "../../device";

const Button = styled.button`
    color: white;
    background-color: ${props => props.theme.color.secondary};
    border: none;
    border-radius: ${props => props.new ? '1px' : '3px'};
    width: ${props => props.width ? props.width : '100%'};
    padding: .5rem 1rem;
    height: 2.5rem;
    font-size: 1rem;
    cursor: pointer;
    margin-top: ${props => props.new ? 0 : '.7rem'};
    outline: none;
    display: flex;
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

    @media ${device.laptop}{
        width: 130px;
        margin-left: .5rem;
    }

`

export default Button;