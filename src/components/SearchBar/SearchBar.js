import styled from 'styled-components'
import { device } from '../../device';

const SearchBar = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media ${device.mobileL}{
        width: 100%;
        flex-direction: row;
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
        margin-left: .5rem;
        flex-direction: row;
    }

    @media ${device.tablet}{
        width: auto;
        margin-left: 0;
        flex-direction: row;
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

export default SearchBar;