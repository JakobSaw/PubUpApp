import i18next from 'i18next';
import moment from 'moment';
import 'moment/locale/de';

export default (date) => {
  return `${moment.unix(date).locale(i18next.language).format('dddd')}, ${
    i18next.language === 'en' ? 'the' : 'der'
  } ${
    moment.unix(date).date() < 10
      ? `0${moment.unix(date).date()}`
      : moment.unix(date).date()
  }.${
    moment.unix(date).month() + 1 < 10
      ? `0${moment.unix(date).month() + 1}`
      : moment.unix(date).month() + 1
  }.${moment.unix(date).year()}`;
};
