import styled from "styled-components";

const Title = styled.h1`
    font-size: ${props => props.theme.font.large};
    font-weight: 400;
    color: ${props => props.theme.color.dark};
    display: flex;
    justify-content: space-between;
`
export default Title;
