import styled from "styled-components";

const Brand = styled.h1`
    text-align: center;
    margin: .7rem auto 1.4rem;
    font-size: ${props => props.extraLarge ? props.theme.font.extraLarge : props.theme.font.large};
    color: ${props => props.theme.color.primary};
    font-weight: 300;

    span {
        color: ${props => props.theme.color.secondary};
        font-weight: 600;
    }
`

export default Brand;