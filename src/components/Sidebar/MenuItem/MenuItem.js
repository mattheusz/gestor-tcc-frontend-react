import styled from 'styled-components';
import { device } from '../../../device';

const MenuItem = styled.li`
    font-size: ${props => props.theme.font.normal};
    font-weight: 300;
    display: block;

    @media ${device.tablet}{
        :last-child{
            display: none;
            margin-right: 15px;
        }
    }
`

export default MenuItem;