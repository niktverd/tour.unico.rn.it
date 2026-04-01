import type { CSSProperties } from "react";
import { EVENT_THEMES } from "./constants";
import type {
  CountdownPart,
  EventState,
  VacationEvent,
} from "./types";

const SCHEDULE_TIME_ZONE = "Etc/GMT-6";

const LOADING_COUNTDOWN: CountdownPart[] = [
  { label: "Days", value: "--" },
  { label: "Hours", value: "--" },
  { label: "Minutes", value: "--" },
  { label: "Seconds", value: "--" },
];

const ZERO_COUNTDOWN: CountdownPart[] = [
  { label: "Days", value: "00" },
  { label: "Hours", value: "00" },
  { label: "Minutes", value: "00" },
  { label: "Seconds", value: "00" },
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function findUpcomingEvent(events: VacationEvent[], nowMs: number) {
  return events.find((event) => Date.parse(event.startsAt) > nowMs) ?? null;
}

export function getCountdownParts(
  nowMs: number | null,
  event: VacationEvent | null,
): CountdownPart[] {
  if (nowMs === null) {
    return LOADING_COUNTDOWN;
  }

  if (!event) {
    return ZERO_COUNTDOWN;
  }

  const totalSeconds = Math.max(
    Math.floor((Date.parse(event.startsAt) - nowMs) / 1000),
    0,
  );
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "Days", value: String(days).padStart(2, "0") },
    { label: "Hours", value: String(hours).padStart(2, "0") },
    { label: "Minutes", value: String(minutes).padStart(2, "0") },
    { label: "Seconds", value: String(seconds).padStart(2, "0") },
  ];
}

export function getEventState(
  event: VacationEvent,
  upcomingEvent: VacationEvent | null,
): EventState {
  if (!upcomingEvent) {
    return "complete";
  }

  if (event.id === upcomingEvent.id) {
    return "next";
  }

  return Date.parse(event.startsAt) < Date.parse(upcomingEvent.startsAt)
    ? "complete"
    : "queued";
}

export function getTimelineDateParts(startsAt: string) {
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: SCHEDULE_TIME_ZONE,
    day: "numeric",
    month: "short",
  }).formatToParts(new Date(startsAt));

  return {
    day: parts.find((part) => part.type === "day")?.value ?? "",
    month:
      parts.find((part) => part.type === "month")?.value
        .replace(".", "")
        .toUpperCase() ?? "",
  };
}

export function getThemeStyle(event: VacationEvent): CSSProperties {
  const theme = EVENT_THEMES[event.id] ?? EVENT_THEMES["vacation-start"];

  return {
    "--theme-accent": theme.accent,
    "--theme-detail": theme.detail,
    "--theme-glow": theme.glow,
    "--theme-image": `url("${event.image}")`,
    "--theme-shadow": theme.shadow,
  } as CSSProperties;
}
