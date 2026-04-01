import type { EventTheme, SurpriseEdge } from "./types";

export const DEFAULT_SPARK_POSITION = { x: 78, y: 18 };
export const SURPRISE_HIDE_DURATION_MS = 680;
export const SURPRISE_VISIBLE_DURATION_MS = 3200;
export const TRIPLE_TAP_DISTANCE_PX = 72;
export const TRIPLE_TAP_WINDOW_MS = 560;
export const SURPRISE_EDGES: SurpriseEdge[] = [
  "top",
  "right",
  "bottom",
  "left",
];
export const SURPRISE_IMAGE_SOURCES = [
  "/egyptian-gods-anubis-flat-by-Vexels.png",
  "/egyptian-gods-isis-flat-by-Vexels.png",
  "/egyptian-gods-ra-flat-by-Vexels.png",
  "/egyptian-gods-seth-flat-by-Vexels.png",
  "/egyptian-symbol-bastet-hand-drawn-by-Vexels.png",
  "/egyptian-symbol-cleopatra-hand-drawn-by-Vexels.png",
  "/egyptian-symbol-mummy-hand-drawn-by-Vexels.png",
  "/egyptian-symbol-pyramid-hand-drawn-by-Vexels.png",
  "/hand-drawn-camel-egypt-symbol-by-Vexels.png",
  "/hand-drawn-egypt-deity-head-symbol-by-Vexels.png",
  "/—Pngtree—illustration anubis head premium_15978485.png",
  "/—Pngtree—ancient egyptian pyramids with winged_23914551.png",
  "/pyramid.webp",
  "/pharaon-masks.webp",
  "/e3ca75673c250874a8fe207b2850c6cd.webp",
  "/641fd984e1a1c5e8304cefe98dd8280c.webp",
  "/49d377285fdf91aa7c52ca96a585f15b.webp",
  "/9e552d3a0b13e642d2330ab96c597508.webp",
] as const;

export const EVENT_THEMES: Record<string, EventTheme> = {
  "nqz-departure": {
    accent: "#ffcc86",
    detail: "rgba(45, 27, 17, 0.72)",
    glow: "rgba(255, 204, 134, 0.44)",
    shadow: "rgba(34, 18, 13, 0.78)",
  },
  "vacation-start": {
    accent: "#ff8a6b",
    detail: "rgba(73, 28, 28, 0.7)",
    glow: "rgba(255, 138, 107, 0.42)",
    shadow: "rgba(35, 15, 20, 0.78)",
  },
  "ssh-arrival": {
    accent: "#ffbe78",
    detail: "rgba(28, 44, 53, 0.72)",
    glow: "rgba(255, 190, 120, 0.42)",
    shadow: "rgba(15, 26, 32, 0.8)",
  },
  aquapark: {
    accent: "#ff7da0",
    detail: "rgba(58, 18, 47, 0.7)",
    glow: "rgba(255, 125, 160, 0.4)",
    shadow: "rgba(18, 20, 44, 0.78)",
  },
  "submarine-walk": {
    accent: "#ffd859",
    detail: "rgba(8, 50, 68, 0.72)",
    glow: "rgba(255, 216, 89, 0.38)",
    shadow: "rgba(3, 22, 34, 0.84)",
  },
  "cairo-trip": {
    accent: "#efb466",
    detail: "rgba(65, 30, 14, 0.72)",
    glow: "rgba(239, 180, 102, 0.4)",
    shadow: "rgba(34, 17, 9, 0.84)",
  },
  diving: {
    accent: "#71d6ff",
    detail: "rgba(5, 39, 63, 0.74)",
    glow: "rgba(113, 214, 255, 0.42)",
    shadow: "rgba(5, 18, 36, 0.86)",
  },
  "saint-catherine": {
    accent: "#f5c96c",
    detail: "rgba(62, 41, 18, 0.74)",
    glow: "rgba(245, 201, 108, 0.38)",
    shadow: "rgba(33, 24, 14, 0.84)",
  },
  safari: {
    accent: "#f4b267",
    detail: "rgba(74, 33, 20, 0.74)",
    glow: "rgba(244, 178, 103, 0.4)",
    shadow: "rgba(39, 19, 12, 0.84)",
  },
  "ssh-return-departure": {
    accent: "#ffdf9f",
    detail: "rgba(53, 27, 19, 0.72)",
    glow: "rgba(255, 223, 159, 0.34)",
    shadow: "rgba(28, 17, 14, 0.84)",
  },
  "nqz-return-arrival": {
    accent: "#ffd59b",
    detail: "rgba(31, 26, 42, 0.74)",
    glow: "rgba(255, 213, 155, 0.3)",
    shadow: "rgba(20, 16, 31, 0.86)",
  },
};
