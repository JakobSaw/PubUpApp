import i18next from 'i18next';
import moment from 'moment';
import 'moment/locale/de';

export default (unix) => {
  let rightUnix = unix * 1000;
  let convertedDate = new Date(rightUnix);
  let eventHour = convertedDate.getHours();
  let eventMinutes = convertedDate.getMinutes();

  if (eventMinutes === 0) {
    eventMinutes = '00';
  } else if (eventMinutes < 10) {
    eventMinutes = `0${eventMinutes}`;
  }
  if (i18next.language === 'en') {
    if (eventHour > 12) return `${eventHour}:${eventMinutes} PM`;
    return `${eventHour}:${eventMinutes} AM`;
  } else {
    return `${eventHour}:${eventMinutes} Uhr`;
  }
};
