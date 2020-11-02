import styled from "styled-components";

const TextField = styled.input`
    display: block;
    border: 1px solid #a9a9a9;
    outline: none;
    border-radius: 1px;
    margin-top: .7rem;
    padding: .5rem .5rem;
    height: 2.5rem;
    font-size: 1rem;
    width: 300px;

    &:focus {
        outline: 0;
        border-color: ${props => props.theme.color.primary};
    }

    ::placeholder {
        color: #a9a9a9;
        opacity: 1;
    }
`
export default TextField