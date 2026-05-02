import { useState, useEffect } from "preact/hooks";

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const pad = (n: number) => String(n).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${pad(minutes)}:${pad(seconds)} ${period}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div class="widget clock-widget">
      <time class="clock-time" dateTime={now.toISOString()}>
        {formatTime(now)}
      </time>
      <p class="clock-date">{formatDate(now)}</p>
    </div>
  );
}
