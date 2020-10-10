import styled from 'styled-components';

export const Logo = styled.h1`
text-align: center;
margin: .7rem auto 1.4rem;
font-size: 2.2rem;
font-weight: 200;
color: ${props => props.theme.color.primary};
font-weight: 300;

span {
    color: ${props => props.theme.color.secondary};
    font-weight: 600;
}
`
