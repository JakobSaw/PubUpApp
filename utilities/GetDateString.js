import i18next from 'i18next';

export default (unix) => {
  let dayNameD;
  let dayNameE;
  let rightUnix = unix;
  let convertedDate = new Date(rightUnix);
  let eventHour = convertedDate.getHours();
  let eventMinutes = convertedDate.getMinutes();
  let todayDay = new Date().getDay();
  let todayDate = new Date().getDate();
  let todayMonth = new Date().getMonth();
  let todayYear = new Date().getFullYear();
  let eventDay = convertedDate.getDay();
  let eventDate = convertedDate.getDate();
  let eventMonth = convertedDate.getMonth();
  let eventMonthDisplay = eventMonth + 1;
  let eventYear = convertedDate.getFullYear();

  if (eventMonthDisplay < 10) {
    eventMonthDisplay = `0${eventMonthDisplay}`;
  }
  if (eventDate < 10) {
    eventDate = `0${eventDate}`;
  }

  if (todayDate < 10) {
    todayDate = `0${todayDate}`;
  }

  if (eventMinutes === 0) {
    eventMinutes = '00';
  } else if (eventMinutes < 10) {
    eventMinutes = `0${eventMinutes}`;
  }

  let tommorrowDate = Date.now() + 86400000;
  let righttommorrowDate = new Date(tommorrowDate);
  let rightrighttommorrowDate = righttommorrowDate.getDate();
  if (rightrighttommorrowDate < 10) {
    rightrighttommorrowDate = `0${rightrighttommorrowDate}`;
  }
  let yesterdayDate = Date.now() - 86400000;
  let rightyesterdayDate = new Date(tommorrowDate);
  let rightrightyesterdayDate = righttommorrowDate.getDate();
  if (rightrightyesterdayDate < 10) {
    rightrightyesterdayDate = `0${rightrightyesterdayDate}`;
  }
  if (
    rightUnix > yesterdayDate &&
    eventDate < todayDate &&
    todayMonth === eventMonth &&
    todayYear === eventYear
  ) {
    dayNameD = 'Gestern, um';
    dayNameE = 'Yesterday, at';
  } else if (
    todayDate === eventDate &&
    todayMonth === eventMonth &&
    todayYear === eventYear
  ) {
    dayNameD = 'Heute, um';
    dayNameE = 'Today, at';
  } else if (
    todayMonth === eventMonth &&
    todayYear === eventYear &&
    rightrighttommorrowDate === eventDate
  ) {
    dayNameD = 'Morgen, um';
    dayNameE = 'Tomorrow, at';
  } else if (eventDay === 0) {
    dayNameD = `Sonntag, der ${eventDate}.${eventMonthDisplay} um`;
    dayNameE = `Sunday, ${eventDate}.${eventMonthDisplay} at`;
  } else if (eventDay === 1) {
    dayNameD = `Montag, der ${eventDate}.${eventMonthDisplay} um`;
    dayNameE = `Monday, ${eventDate}.${eventMonthDisplay} at`;
  } else if (eventDay === 2) {
    dayNameD = `Dienstag, der ${eventDate}.${eventMonthDisplay} um`;
    dayNameE = `Tuesday, ${eventDate}.${eventMonthDisplay} at`;
  } else if (eventDay === 3) {
    dayNameD = `Mittwoch, der ${eventDate}.${eventMonthDisplay} um`;
    dayNameE = `Wednesday, ${eventDate}.${eventMonthDisplay} at`;
  } else if (eventDay === 4) {
    dayNameD = `Donnerstag, der ${eventDate}.${eventMonthDisplay} um`;
    dayNameE = `Thursday, ${eventDate}.${eventMonthDisplay} at`;
  } else if (eventDay === 5) {
    dayNameD = `Freitag, der ${eventDate}.${eventMonthDisplay} um`;
    dayNameE = `Friday, ${eventDate}.${eventMonthDisplay} at`;
  } else if (eventDay === 6) {
    dayNameD = `Samstag, der ${eventDate}.${eventMonthDisplay} um`;
    dayNameE = `Saturday, ${eventDate}.${eventMonthDisplay} at`;
  }

  if (i18next.language === 'en') {
    return `${dayNameE} ${eventHour}:${eventMinutes}`;
  } else {
    return `${dayNameD} ${eventHour}:${eventMinutes}`;
  }
};
