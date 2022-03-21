import moment from "moment";

export const parseDate = (date) => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
}
export const parseDateTime = (date) => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
}