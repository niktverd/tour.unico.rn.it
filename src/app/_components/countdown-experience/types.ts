import eventsData from "../../_data/events.json";

export type VacationEvent = (typeof eventsData)[number];

export type SparkState = {
  key: number;
  x: number;
  y: number;
};

export type SurpriseEdge = "top" | "right" | "bottom" | "left";

export type SurpriseImageState = {
  edge: SurpriseEdge;
  key: number;
  phase: "visible" | "leaving";
  rotation: number;
  src: string;
  x: number;
  y: number;
};

export type EventTheme = {
  accent: string;
  detail: string;
  glow: string;
  shadow: string;
};

export type CountdownPart = {
  label: "Days" | "Hours" | "Minutes" | "Seconds";
  value: string;
};

export type EventState = "complete" | "next" | "queued";
