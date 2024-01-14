function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function durationSince(date: Date): string {
  const milliseconds = date.getTime() - new Date().getTime();

  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `${padTo2Digits(hours)} ชั่วโมง ${padTo2Digits(minutes)} นาที`;
}

export function toNanoSecond(hours: number, minutes: number): number {
  return (hours * 60 * 60 + minutes * 60) * 1e9;
}

export function nanoSecondToHourMinute(nano: number): {
  hours: number;
  minutes: number;
} {
  let seconds = nano / 1e9;
  let minutes = Math.floor(seconds / 60);
  let hours = minutes / 60;

  return {
    hours: Math.floor(hours),
    minutes: minutes % 60,
  };
}
