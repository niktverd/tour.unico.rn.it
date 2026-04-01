"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import eventsData from "../../_data/events.json";
import styles from "../../page.module.css";
import { CountdownHero } from "./countdown-hero";
import { EventTimeline } from "./event-timeline";
import {
  findUpcomingEvent,
  formatLocalEventDateTime,
  getCountdownParts,
  getEventState,
  getThemeStyle,
} from "./helpers";
import { SceneBackdrop, SceneMotionEffects } from "./scene-effects";
import type { VacationEvent } from "./types";
import { useSceneInteractions } from "./use-scene-interactions";

export default function CountdownExperienceRoot() {
  const eventCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const timelineRef = useRef<HTMLElement | null>(null);
  const previousImageRef = useRef(eventsData[0].image);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);
  const [fadingImage, setFadingImage] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const {
    gustKey,
    handlePointerDown,
    handlePointerMove,
    handleTouchMove,
    handleTouchStart,
    handleWheel,
    resetPointerPosition,
    sceneRef,
    spark,
    triggerSpark,
  } = useSceneInteractions();

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

  const upcomingEvent =
    nowMs === null ? eventsData[0] : findUpcomingEvent(eventsData, nowMs);
  const fallbackEvent = upcomingEvent ?? eventsData[eventsData.length - 1];
  const focusedEvent =
    eventsData.find((event) => event.id === focusedEventId) ?? fallbackEvent;
  const countdownParts = getCountdownParts(nowMs, focusedEvent);
  const activeImage = focusedEvent.image;
  const localEventDateTime =
    typeof window === "undefined"
      ? null
      : formatLocalEventDateTime(focusedEvent.startsAt);
  const sceneStyle = getThemeStyle(focusedEvent);
  const focusedState = getEventState(focusedEvent, upcomingEvent);

  useEffect(() => {
    const previousImage = previousImageRef.current;

    if (!previousImage || previousImage === activeImage) {
      previousImageRef.current = activeImage;
      return;
    }

    setFadingImage(previousImage);
    previousImageRef.current = activeImage;

    const timeoutId = window.setTimeout(() => {
      setFadingImage(null);
    }, 720);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeImage]);

  useEffect(() => {
    const timeline = timelineRef.current;
    const selectedEventCard = eventCardRefs.current[focusedEvent.id];

    if (!timeline || !selectedEventCard) {
      return;
    }

    const timelineRect = timeline.getBoundingClientRect();
    const cardRect = selectedEventCard.getBoundingClientRect();
    const nextScrollLeft =
      timeline.scrollLeft +
      (cardRect.left - timelineRect.left) -
      (timelineRect.width - cardRect.width) / 2;
    const maxScrollLeft = timeline.scrollWidth - timeline.clientWidth;

    timeline.scrollTo({
      behavior: "smooth",
      left: Math.min(Math.max(nextScrollLeft, 0), Math.max(maxScrollLeft, 0)),
    });
  }, [focusedEvent.id]);

  function handleEventSelection(event: VacationEvent) {
    startTransition(() => {
      setFocusedEventId(event.id);
    });
  }

  function registerEventCardRef(
    eventId: string,
    element: HTMLButtonElement | null,
  ) {
    eventCardRefs.current[eventId] = element;
  }

  function registerTimelineRef(element: HTMLElement | null) {
    timelineRef.current = element;
  }

  return (
    <main className={styles.page}>
      <section
        ref={sceneRef}
        aria-label={focusedEvent.name}
        className={styles.scene}
        onPointerDown={handlePointerDown}
        onPointerLeave={resetPointerPosition}
        onPointerMove={handlePointerMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
        style={sceneStyle}
      >
        <SceneBackdrop activeImage={activeImage} fadingImage={fadingImage} />

        <div className={styles.frame}>
          <CountdownHero
            countdownParts={countdownParts}
            eventState={focusedState}
            focusedEvent={focusedEvent}
            localEventDateTime={localEventDateTime}
          />

          <EventTimeline
            eventState={focusedState}
            events={eventsData}
            focusedEventId={focusedEvent.id}
            onSelectEvent={handleEventSelection}
            onTriggerSpark={triggerSpark}
            registerTimelineRef={registerTimelineRef}
            registerEventCardRef={registerEventCardRef}
            upcomingEvent={upcomingEvent}
          />
        </div>

        <SceneMotionEffects gustKey={gustKey} spark={spark} />
      </section>
    </main>
  );
}
