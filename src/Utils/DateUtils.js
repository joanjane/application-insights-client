export class DateUtils {
  formatDate(date) {
    return `${this.formatTwoDigit(date.getFullYear())}-${this.formatTwoDigit(date.getMonth() + 1)}-${this.formatTwoDigit(date.getDate())}`;
  }

  formatTime(date) {
    return `${this.formatTwoDigit(date.getHours())}:${this.formatTwoDigit(date.getMinutes())}:${this.formatTwoDigit(date.getSeconds())}`;
  }

  formatDateTime(date) {
    if (!date) {
      return '-';
    }
    return this.formatDate(date) + ' ' + this.formatTime(date);
  }

  formatTwoDigit(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  }
}