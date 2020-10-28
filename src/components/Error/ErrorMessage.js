import styled from "styled-components";

const ErrorMessage = styled.p`
    color: ${props => props.theme.color.secondary};
    margin: ${props => props.left ? '.1rem .5rem 0' : '.7rem 0 0 0'};
    font-size: 1.05rem;
    text-align: ${props => props.left ? 'left' : 'center'};;
`

export default ErrorMessage;
