import styled from 'styled-components';
import { device } from '../../device';

const Select = styled.select`
    height: 2.5rem;
    outline: none;
    border: 1px solid ${props => props.theme.color.grey};
    cursor: pointer;
    margin-top: .5rem;

    @media ${device.mobileS} {
        max-width: 93%;
    }

    @media ${device.mobileL} {
        margin-left: .5rem;
        width: 80px;
        margin-top: 0;
    }

    @media ${device.tablet}{
        width: 80px;
        margin-left: .5rem;
    }
    
    @media ${device.laptop}{
        width: 90px;
        margin-left: .5rem;
    }

    &:focus {
        outline: 0;
        border-color: ${props => props.theme.color.primary};
    }
`

export default Select;