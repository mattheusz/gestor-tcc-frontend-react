import { Link } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-color:  #F0F2F5;
`

export const Form = styled.div`
    position: relative;
    width: 380px;
    padding: 1.2rem 1.2rem 1.5rem;
    margin: 1rem auto;
    border: 1px solid  #DDDFE2;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 8px 16px 0px;
    border-radius: 8px;
    background-color: #fff;
`

export const InputGroup = styled.div`
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
    margin-top: .7rem;
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

export const Button = styled.button`
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

    &:hover{
        background-color: ${props => props.theme.color.secondaryShadow}
    }
`

export const SubTitle = styled.h2`
    text-align: center;
    margin: 0 auto 1rem;
    font-size: 1.2rem;
    font-weight: 400;
    color: #1C1E21;
`

export const Paragraph = styled.p`
    text-align: center;
    margin: 0 auto 1rem;
    font-size: 1rem;
    font-weight: 400;
    color: #8E8E8E;
`

export const SimpleLink = styled(Link)`
    text-decoration: none;
    color: ${props => props.theme.color.primary};
    text-align: center;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 1rem;
    display: inline-block;

    &:hover{
        color: ${props => props.theme.color.primaryShadow}
    }
`