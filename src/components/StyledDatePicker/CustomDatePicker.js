
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR"; // the locale you want
import IconTextField from '../IconTextField';
import { FiCalendar } from 'react-icons/fi';
import light from '../../themes/light';

registerLocale("pt-BR", ptBR); // register it with the name you want


function CustomDatePicker({ value, locale, onChange, style, error, placeholder, startDate, dateIsLoaded, minDate }) {

    const borderColor = error && light.color.secondary;
    console.debug('minDate', minDate)
    return (
        <IconTextField >
            <FiCalendar />
            <StyledDatePicker
                selected={value}
                onChange={onChange}
                locale={locale}
                dateFormat="dd/MM/yyyy"
                borderColor={borderColor}
                placeholderText={placeholder}
                startDate={startDate}
                minDate={minDate}

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
    border-color: ${props => props.borderColor};
    z-index: 5;

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