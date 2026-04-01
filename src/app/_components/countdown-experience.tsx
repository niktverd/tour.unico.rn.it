"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import eventsData from "../_data/events.json";
import styles from "../page.module.css";

type VacationEvent = (typeof eventsData)[number];

type SparkState = {
  key: number;
  x: number;
  y: number;
};

const SCHEDULE_TIME_ZONE = "Etc/GMT-6";
const SCHEDULE_OFFSET_LABEL = "GMT+06:00";
const DEFAULT_SPARK_POSITION = { x: 78, y: 18 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function findUpcomingEvent(nowMs: number) {
  return eventsData.find((event) => Date.parse(event.startsAt) > nowMs) ?? null;
}

function getCountdownParts(nowMs: number | null, event: VacationEvent | null) {
  if (nowMs === null) {
    return [
      { label: "Days", value: "--" },
      { label: "Hours", value: "--" },
      { label: "Minutes", value: "--" },
      { label: "Seconds", value: "--" },
    ];
  }

  if (!event) {
    return [
      { label: "Days", value: "00" },
      { label: "Hours", value: "00" },
      { label: "Minutes", value: "00" },
      { label: "Seconds", value: "00" },
    ];
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

function formatClientNow(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function formatClientEvent(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function formatScheduleEventCompact(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatScheduleEvent(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getEventState(event: VacationEvent, upcomingEvent: VacationEvent | null) {
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

function DesertSilhouette() {
  return (
    <svg
      aria-hidden="true"
      className={styles.desertArt}
      viewBox="0 0 430 240"
      preserveAspectRatio="none"
    >
      <path
        className={styles.duneBack}
        d="M0 194 C43 176 69 176 103 188 C143 202 178 212 224 198 C259 188 299 164 343 168 C380 171 404 183 430 194 V240 H0 Z"
      />
      <path
        className={styles.duneFront}
        d="M0 212 C39 204 75 198 113 205 C155 213 193 229 248 217 C301 205 330 184 377 188 C400 190 418 200 430 208 V240 H0 Z"
      />
      <polygon
        className={styles.pyramidFar}
        points="60,196 104,118 144,196"
      />
      <polygon
        className={styles.pyramidMain}
        points="118,204 190,72 256,204"
      />
      <polygon
        className={styles.pyramidNear}
        points="220,205 276,110 330,205"
      />
      <path
        className={styles.sphinxShape}
        d="M320 201 L334 188 L347 191 L353 184 L366 184 L372 194 L381 194 L387 201 Z"
      />
      <path
        className={styles.camelShape}
        d="M30 204 L36 190 L44 190 L50 183 L58 183 L65 190 L75 190 L82 184 L90 184 L95 190 L104 190 L108 196 L118 196 L120 204 L112 204 L110 214 L106 214 L104 204 L90 204 L88 216 L84 216 L82 204 L58 204 L54 216 L50 216 L48 204 Z"
      />
    </svg>
  );
}

export default function CountdownExperience() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const lastInteractionAt = useRef(0);
  const [isClient, setIsClient] = useState(false);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [gustKey, setGustKey] = useState(0);
  const [spark, setSpark] = useState<SparkState>({
    key: 0,
    ...DEFAULT_SPARK_POSITION,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tickClock = useEffectEvent(() => {
    setNowMs(Date.now());
  });

  useEffect(() => {
    tickClock();
    const intervalId = window.setInterval(() => {
      tickClock();
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      return undefined;
    });
  }, []);

  const activeEvent =
    nowMs === null
      ? eventsData[0]
      : findUpcomingEvent(nowMs) ?? eventsData[eventsData.length - 1];
  const upcomingEvent = nowMs === null ? eventsData[0] : findUpcomingEvent(nowMs);
  const countdownParts = getCountdownParts(nowMs, upcomingEvent);
  const localNow = nowMs === null ? null : new Date(nowMs);
  const clientTimeZone =
    !isClient || typeof Intl === "undefined"
      ? "Your timezone"
      : Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";

  function updatePointerPosition(clientX: number, clientY: number) {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const rect = scene.getBoundingClientRect();
    const pointerX = clamp((clientX - rect.left) / rect.width, 0, 1);
    const pointerY = clamp((clientY - rect.top) / rect.height, 0, 1);

    scene.style.setProperty("--pointer-x", pointerX.toFixed(3));
    scene.style.setProperty("--pointer-y", pointerY.toFixed(3));
  }

  function resetPointerPosition() {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    scene.style.setProperty("--pointer-x", "0.5");
    scene.style.setProperty("--pointer-y", "0.45");
  }

  function shouldAnimate() {
    const timestamp = performance.now();

    if (timestamp - lastInteractionAt.current < 220) {
      return false;
    }

    lastInteractionAt.current = timestamp;
    return true;
  }

  function triggerSpark(clientX?: number, clientY?: number) {
    const scene = sceneRef.current;
    let nextX = DEFAULT_SPARK_POSITION.x;
    let nextY = DEFAULT_SPARK_POSITION.y;

    if (scene && typeof clientX === "number" && typeof clientY === "number") {
      const rect = scene.getBoundingClientRect();
      nextX = clamp(((clientX - rect.left) / rect.width) * 100, 8, 92);
      nextY = clamp(((clientY - rect.top) / rect.height) * 100, 8, 86);
    }

    startTransition(() => {
      setSpark((current) => ({
        key: current.key + 1,
        x: nextX,
        y: nextY,
      }));
    });
  }

  function triggerGust() {
    if (!shouldAnimate()) {
      return;
    }

    startTransition(() => {
      setGustKey((current) => current + 1);
    });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    updatePointerPosition(event.clientX, event.clientY);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    updatePointerPosition(event.clientX, event.clientY);
    triggerSpark(event.clientX, event.clientY);
  }

  function handleTouchStart(event: ReactTouchEvent<HTMLElement>) {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    updatePointerPosition(touch.clientX, touch.clientY);
    triggerSpark(touch.clientX, touch.clientY);
  }

  function handleTouchMove(event: ReactTouchEvent<HTMLElement>) {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    updatePointerPosition(touch.clientX, touch.clientY);

    if (event.cancelable) {
      event.preventDefault();
    }

    triggerGust();
  }

  function handleWheel(event: ReactWheelEvent<HTMLElement>) {
    if (event.cancelable) {
      event.preventDefault();
    }

    triggerGust();
  }

  const nextEventDate = new Date(activeEvent.startsAt);
  const title = upcomingEvent
    ? `Countdown to ${upcomingEvent.name}`
    : "Egypt countdown complete";

  return (
    <main className={styles.page}>
      <section
        ref={sceneRef}
        aria-label={title}
        className={styles.scene}
        onPointerDown={handlePointerDown}
        onPointerLeave={resetPointerPosition}
        onPointerMove={handlePointerMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
      >
        <div className={styles.landscapeLock}>
          <strong>Portrait Only</strong>
          <p>Rotate back to vertical mode to keep the desert aligned.</p>
        </div>

        <div aria-hidden="true" className={styles.skyGlow} />
        <div aria-hidden="true" className={styles.skyPattern} />
        <div aria-hidden="true" className={styles.floatingOrb} />

        <div className={styles.frame}>
          <header className={styles.topbar}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>PWA</span>
              <span className={styles.badge}>Schedule {SCHEDULE_OFFSET_LABEL}</span>
              <span className={styles.badge} suppressHydrationWarning>
                {clientTimeZone}
              </span>
            </div>
            <time
              className={styles.clientClock}
              dateTime={localNow ? localNow.toISOString() : undefined}
              suppressHydrationWarning
            >
              {isClient && localNow
                ? formatClientNow(localNow)
                : "Syncing your local sky clock..."}
            </time>
          </header>

          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Egypt Escape Countdown</p>
              <h1>Days until the desert turns real.</h1>
              <p className={styles.heroText}>
                Vacation kickoff is locked to April 24, 2026 at 08:00{" "}
                {SCHEDULE_OFFSET_LABEL}. The page always counts down to the next
                moment in the Egypt plan.
              </p>
            </div>
            <button
              className={styles.sunButton}
              onPointerDown={(event) => {
                event.stopPropagation();
                triggerSpark(event.clientX, event.clientY);
              }}
              type="button"
            >
              Wake the sun
            </button>
          </div>

          <section className={styles.timerPanel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelLabel}>Next event</p>
                <h2>{upcomingEvent ? upcomingEvent.name : "All listed moments landed"}</h2>
              </div>
              <div className={styles.metaStack}>
                <span>{activeEvent.place}</span>
                <span>
                  {formatScheduleEvent(nextEventDate)} {SCHEDULE_OFFSET_LABEL}
                </span>
              </div>
            </div>

            <div className={styles.countdownGrid}>
              {countdownParts.map((part) => (
                <article className={styles.countCard} key={part.label}>
                  <span aria-hidden="true" className={styles.cardHalo} />
                  <strong className={styles.countValue}>
                    <span
                      className={styles.countValueInner}
                      key={`${part.label}-${part.value}`}
                    >
                      {part.value}
                    </span>
                  </strong>
                  <span className={styles.countLabel}>{part.label}</span>
                </article>
              ))}
            </div>

            <p className={styles.localTarget}>
              In your timezone:{" "}
              <time
                dateTime={nextEventDate.toISOString()}
                suppressHydrationWarning
              >
                {isClient
                  ? formatClientEvent(nextEventDate)
                  : "Loading local conversion..."}
              </time>
            </p>
          </section>

          <section className={styles.timeline}>
            <div className={styles.timelineHeader}>
              <p className={styles.panelLabel}>Event caravan</p>
              <span className={styles.timelineHint}>
                Hover cards, tap the sun, or try scrolling the dunes.
              </span>
            </div>

            <div className={styles.eventList}>
              {eventsData.map((event, index) => {
                const state = getEventState(event, upcomingEvent);
                const eventDate = new Date(event.startsAt);

                return (
                  <article
                    className={styles.eventItem}
                    data-state={state}
                    key={event.id}
                  >
                    <div className={styles.eventNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className={styles.eventCopy}>
                      <h3>{event.name}</h3>
                      <p>{event.description}</p>
                    </div>
                    <time
                      className={styles.eventTime}
                      dateTime={eventDate.toISOString()}
                      suppressHydrationWarning
                    >
                      {formatScheduleEventCompact(eventDate)} {SCHEDULE_OFFSET_LABEL}
                    </time>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <DesertSilhouette />

        <div aria-hidden="true" className={styles.gust} key={`gust-${gustKey}`}>
          <span className={styles.gustLine} />
          <span className={styles.gustLine} />
          <span className={styles.gustLine} />
          <span className={styles.gustDot} />
          <span className={styles.gustDot} />
          <span className={styles.gustDot} />
        </div>

        <div
          aria-hidden="true"
          className={styles.sparkBurst}
          key={`spark-${spark.key}`}
          style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
        >
          <span className={styles.spark} />
          <span className={styles.spark} />
          <span className={styles.spark} />
          <span className={styles.spark} />
          <span className={styles.spark} />
          <span className={styles.spark} />
        </div>
      </section>
    </main>
  );
}
