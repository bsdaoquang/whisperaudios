import {add0ToNumber} from './add0ToNumber';

export class GetTime {
  static getTimeProgress = (time: number) => {
    //console.log(time);

    let hour = Math.floor(time / 3600);
    let min = Math.floor((time - hour * 3600) / 60);

    if (min > 59) {
      min = min - 59;
      hour += 1;
    }

    const second = Math.floor(time % 60);

    return `${hour > 0 ? `${add0ToNumber(hour)}:` : ''}${add0ToNumber(
      min,
    )}:${add0ToNumber(second)}`;
  };

  static getDateTimeString = (date: string) => {
    const newDate = new Date(date);

    return `${add0ToNumber(newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
  };

  static getFullTimeString = (date: number) => {
    const newDate = new Date(date);

    return `${add0ToNumber(newDate.getDate())}/${add0ToNumber(
      newDate.getMonth() + 1,
    )}/${newDate.getFullYear()} ${add0ToNumber(
      newDate.getHours(),
    )}:${add0ToNumber(newDate.getMinutes())}`;
  };
}
