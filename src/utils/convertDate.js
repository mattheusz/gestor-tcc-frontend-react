import format from 'date-fns/format'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const convertUTCToZonedTime = (dateUTC) => {
    return format(utcToZonedTime(new Date(dateUTC)), 'dd/MM/yyyy');
}

export const convertZonedTimeToUTC = (dateUTC) => {
    return format(zonedTimeToUtc(new Date(dateUTC)), 'dd/MM/yyyy', 'Europe/London');
}