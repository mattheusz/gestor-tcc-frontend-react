import styled from 'styled-components';

const Header = styled.header`
    position: fixed;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    z-index: 5;
`

export default Header;