import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtcDateService {

  constructor() { }

  setUTCDate(utcDateString: any) {
    var temp_date: string = utcDateString.toString();
    // return if input date is null or undefined
    if (!temp_date) {
      return;
    }
    // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
    if (temp_date.indexOf('Z') === -1 && temp_date.indexOf('+') === -1) {
      temp_date += 'Z'; // ISO-8601 formatted date returned from server
    }
    temp_date = this.getFormatedDateForIE(temp_date);
    var newDate = new Date(temp_date);
    return newDate;//this.datePipe.transform(utcDateString, format);
  }

  getFormatedDateForIE(utcDateString: string) {
    if (utcDateString.indexOf('T') < 0) {

      var dateArray = utcDateString.split(' ');
      var datePart = dateArray[0];
      var timePart = dateArray[1];
      var datePartArray = datePart.split('-');
      var year = datePartArray[0];
      var month = Number(datePartArray[1]) < 10 ? "0" + Number(datePartArray[1]) : Number(datePartArray[1]);
      var day = Number(datePartArray[2]) < 10 ? "0" + Number(datePartArray[2]) : Number(datePartArray[2]);

      var timePartArray = timePart.split(':');
      var hours = Number(timePartArray[0]) < 10 ? "0" + Number(timePartArray[0]) : Number(timePartArray[0]);
      var minuits = Number(timePartArray[1]) < 10 ? "0" + Number(timePartArray[1]) : Number(timePartArray[1]);
      // var secondAndMs = timePartArray[2];
      var secondAndMs = Number(timePartArray[1]) < 10 ? "0" + Number(timePartArray[1]) : Number(timePartArray[1]);
      return year + "-" + month + "-" + day + "T" + hours + ":" + minuits + ":" + secondAndMs;
    } else {
      return utcDateString;
    }
  }

  getUtcDate(utcDateString: string) {
    var now = this.setUTCDate(utcDateString);
    return this.getBrowserLanguageDateTimeFormat(now);
  }

  convertUTCDateToLocalDate(inputDate, returnNAIfInvalid = false) {
    var defaultDateString = '1900-01-01T00:00:00';
    if (returnNAIfInvalid && (defaultDateString == inputDate))
      return '';

    return this.getUtcDate(inputDate);
  }

  //Returns date format according to language set in browser
  getBrowserLanguageDateTimeFormat(utcDateString) {

    var useSelectedLanguage = navigator.language;
    var date = new Date(utcDateString);
    var options = { year: "numeric", month: "2-digit", day: "2-digit", hours: "2-digit", minutes: "2-digit", seconds: "2-digit" };
    var dateString = date.toLocaleString(useSelectedLanguage);
    return dateString;
  }

  //Returns univarsalDateTimeFormat specified for Application
  univarsalDateTimeFormat(utcDateString) {
    var date = new Date(utcDateString);
    var monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var hours = date.getHours();
    var days = date.getDay();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutess = minutes < 10 ? "0" + minutes : minutes;
    var hourss = hours < 10 ? "0" + hours : hours;
    var day = date.getDate();
    var daydate = day < 10 ? "0" + day : day;
    var secondss = seconds < 10 ? "0" + seconds : seconds;
    var currentDate = monthsList[date.getMonth()] + ' ' + daydate + ', ' + date.getFullYear() + ', ' + hourss + ':' + minutess + ':' + seconds + ' ' + ampm;
    return currentDate;
  }
}
