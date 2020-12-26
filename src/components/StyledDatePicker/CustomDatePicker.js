
import React from 'react';
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR"; // the locale you want
import IconTextField from '../IconTextField';
import { FiCalendar } from 'react-icons/fi';

registerLocale("pt-BR", ptBR); // register it with the name you want


function CustomDatePicker({ startDate, locale, setStartDate }) {
    return (
        <IconTextField>
            <FiCalendar />
            <StyledDatePicker
                selected={startDate}
                onChange={setStartDate}
                locale={locale}
                dateFormat="dd/MM/yyyy"
            />
        </IconTextField>
    );
}

const StyledDatePicker = styled(DatePicker)`
    display: block;
    border: 1px solid #a9a9a9;
    outline: none;
    border-radius: 3px;
    margin: 0;
    margin-top: .1rem;
    margin-bottom: .7rem;
    padding: .5rem .2rem;
    padding-left: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    width: 100%;

    &:focus {
        outline: 0;
        padding-left: 2rem;
        border-color: ${props => props.theme.color.primary};
    }

    ::placeholder {
        color: #a9a9a9;
        opacity: 1;
    }
`;

export default CustomDatePicker;