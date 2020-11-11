import styled from "styled-components";

const IconTextField = styled.div`
    position: relative;

    svg{
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #595959;
    }
`

export const Input = styled.input`
    display: block;
    border: 1px solid #a9a9a9;
    outline: none;
    border-radius: 3px;
    margin-top: .1rem;
    margin-bottom: .7rem;
    padding: .5rem .2rem;
    padding-left: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    width: 100%;

    &:focus {
        outline: 0;
        padding-left: 2rem;
        border-color: ${props => props.theme.color.primary};
    }

    ::placeholder {
        color: #a9a9a9;
        opacity: 1;
    }
`

export default IconTextField;