import styled from "styled-components";
import { device } from "../../device";

const CenterForm = styled.form`
    position: relative;
    padding: 1.2rem 1.2rem 1.5rem;
    margin: 1rem auto;
    border: 1px solid  #DDDFE2;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 8px 16px 0px;
    border-radius: 8px;
    background-color: #fff;

    @media ${device.mobileS} {
        max-width: 93%;
    }

    @media ${device.mobileL} {
        width: 380px;
        
    }

    @media ${device.tablet}{
        width: 380px;
    }
`

export default CenterForm;