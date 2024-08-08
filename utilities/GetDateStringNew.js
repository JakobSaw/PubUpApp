import i18next from 'i18next';

export default (unix) => {
  let dayNameD;
  let dayNameE;
  let rightUnix = unix;
  let convertedDate = new Date(rightUnix);
  let eventHour = convertedDate.getHours();
  let eventMinutes = convertedDate.getMinutes();
  let todayDate = new Date().getDate();
  let todayMonth = new Date().getMonth();
  let todayYear = new Date().getFullYear();
  let eventDay = convertedDate.getDay();
  let eventDate = convertedDate.getDate();
  let eventDateDisplay;
  let eventMonth = convertedDate.getMonth();
  let eventMonthDisplay = eventMonth + 1;
  let eventYear = convertedDate.getFullYear();

  if (eventMonthDisplay < 10) {
    eventMonthDisplay = `0${eventMonthDisplay}`;
  }
  if (eventDate < 10) {
    eventDateDisplay = `0${eventDate}`;
  } else {
    eventDateDisplay = eventDate;
  }
  if (
    todayDate === eventDate &&
    todayMonth === eventMonth &&
    todayYear === eventYear
  ) {
    dayNameD = 'Heute';
    dayNameE = 'Today';
  } else if (
    todayMonth === eventMonth &&
    todayYear === eventYear &&
    todayDate + 1 === eventDate
  ) {
    dayNameD = 'Morgen';
    dayNameE = 'Tomorrow';
  } else if (eventDay === 0) {
    dayNameD = `Sonntag, ${eventDateDisplay}.${eventMonthDisplay}`;
    dayNameE = `Sunday, ${eventDateDisplay}.${eventMonthDisplay}`;
  } else if (eventDay === 1) {
    dayNameD = `Montag, ${eventDateDisplay}.${eventMonthDisplay}`;
    dayNameE = `Monday, ${eventDateDisplay}.${eventMonthDisplay}`;
  } else if (eventDay === 2) {
    dayNameD = `Dienstag, ${eventDateDisplay}.${eventMonthDisplay}`;
    dayNameE = `Tuesday, ${eventDateDisplay}.${eventMonthDisplay}`;
  } else if (eventDay === 3) {
    dayNameD = `Mittwoch, ${eventDateDisplay}.${eventMonthDisplay}`;
    dayNameE = `Wednesday, ${eventDateDisplay}.${eventMonthDisplay}`;
  } else if (eventDay === 4) {
    dayNameD = `Donnerstag, ${eventDateDisplay}.${eventMonthDisplay}`;
    dayNameE = `Thursday, ${eventDateDisplay}.${eventMonthDisplay}`;
  } else if (eventDay === 5) {
    dayNameD = `Freitag, ${eventDateDisplay}.${eventMonthDisplay}`;
    dayNameE = `Friday, ${eventDateDisplay}.${eventMonthDisplay}`;
  } else if (eventDay === 6) {
    dayNameD = `Samstag, ${eventDateDisplay}.${eventMonthDisplay}`;
    dayNameE = `Saturday, ${eventDateDisplay}.${eventMonthDisplay}`;
  }
  if (eventMinutes === 0) {
    eventMinutes = '00';
  } else if (eventMinutes < 10) {
    eventMinutes = `0${eventMinutes}`;
  }
  if (i18next.language === 'en') {
    return `${dayNameE}`;
    // return `${dayNameE} ${eventHour}:${eventMinutes}`
  } else {
    return `${dayNameD}`;
    // return `${dayNameD} ${eventHour}:${eventMinutes}`
  }
};
