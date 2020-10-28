import styled from "styled-components";

const Button = styled.button`
    color: white;
    background-color: ${props => props.theme.color.secondary};
    border: none;
    border-radius: 3px; 
    width: 100%;
    padding: .5rem 1rem;
    height: 2.5rem;
    font-size: 1rem;
    cursor: pointer;
    margin-top: .7rem;
    outline:none;

    &:hover{
        background-color: ${props => props.theme.color.secondaryShadow}
    }

    &:disabled{
        background-color: ${props => props.theme.color.secondaryLight}
    }
`

export default Button;