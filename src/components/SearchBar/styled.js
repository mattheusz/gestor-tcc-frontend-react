import styled from 'styled-components'
import { device } from '../../device';


export const StyledSearchBar = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media ${device.mobileL}{
        width: 100%;
        flex-direction: column;
        justify-content: space-between;
    }

    @media ${device.tablet}{
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
    }
`
export const LeftSearchBar = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media ${device.mobileL}{
        width: auto;
        flex-direction: column;
    }

    @media ${device.tablet}{
        width: auto;
        margin-left: 0;
        margin-right: .5rem;
        flex-direction: row;
        justify-content: flex-start;
        flex: 1 1 310px;
    }
`

export const RightSearchBar = styled.div`
    width: auto;
    @media ${device.tablet}{
        width: auto;
        margin-left: 0;
        flex-direction: row;
    }
`