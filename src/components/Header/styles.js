import styled from 'styled-components';


export const headerStyle = {
    position: 'fixed',
    width: '100%',
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    zIndex: '-2',
}


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
