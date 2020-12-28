import styled from "styled-components";
import { device } from "../../device";

const BoxSearchButton = styled.div`
    display: flex;
    height: 2.5rem;
    width: 100%;

    @media ${device.tablet}{
        flex: 0 1 310px;
    }

`
export default BoxSearchButton

export const SearchInput = styled.input`
    display: inline-block;
    border: 1px solid #a9a9a9;
    border-right: 0;
    outline: none;
    border-radius: 1px 0 0 1px;
    padding: .5rem .5rem;
    height: 100%;
    font-size: 1rem;
    flex-grow: 1;
    

    &:focus {
        outline: 0;
        border-color: ${props => props.theme.color.primary};
    }

    ::placeholder {
        color: #a9a9a9;
        opacity: 1;
    }

    @media ${device.tablet}{
        flex: 1 1 250;
    }
`

export const SearchButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.color.primary};
    cursor: pointer;
    border: 1px solid ${props => props.theme.color.primary};
    border-left: 0;
    outline: none;
    border-radius: 0 1px 1px 0;
    padding: .5rem .5rem;
    height: 100%;
    font-size: 1rem;
    width: 40px;

    &:focus {
        outline: 0;
        border-color: ${props => props.theme.color.primary};
    }

    &:hover {
        background-color: ${props => props.theme.color.primaryShadow};
    }

    ::placeholder {
        color: #a9a9a9;
        opacity: 1;
    }
`
