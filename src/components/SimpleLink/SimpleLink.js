import { Link } from "react-router-dom";
import styled from "styled-components";

const SimpleLink = styled(Link)`
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
export default SimpleLink