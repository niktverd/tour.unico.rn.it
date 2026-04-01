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
  getCountdownParts,
  getEventState,
  getThemeStyle,
} from "./helpers";
import { SceneBackdrop, SceneMotionEffects } from "./scene-effects";
import type { VacationEvent } from "./types";
import { useSceneInteractions } from "./use-scene-interactions";

export default function CountdownExperienceRoot() {
  const eventCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);
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
    triggerGust,
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
  const sceneStyle = getThemeStyle(focusedEvent);
  const focusedState = getEventState(focusedEvent, upcomingEvent);

  useEffect(() => {
    const selectedEventCard = eventCardRefs.current[focusedEvent.id];

    if (!selectedEventCard) {
      return;
    }

    selectedEventCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [focusedEvent.id]);

  function handleToggleDetails(timestamp: number) {
    setDetailsOpen((open) => !open);
    triggerGust(timestamp);
  }

  function handleEventSelection(event: VacationEvent) {
    startTransition(() => {
      setFocusedEventId(event.id);
      setDetailsOpen(false);
    });
  }

  function registerEventCardRef(
    eventId: string,
    element: HTMLButtonElement | null,
  ) {
    eventCardRefs.current[eventId] = element;
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
        <SceneBackdrop />

        <div className={styles.frame}>
          <CountdownHero
            countdownParts={countdownParts}
            detailsOpen={detailsOpen}
            eventState={focusedState}
            focusedEvent={focusedEvent}
            onToggleDetails={handleToggleDetails}
          />

          <EventTimeline
            eventState={focusedState}
            events={eventsData}
            focusedEventId={focusedEvent.id}
            onSelectEvent={handleEventSelection}
            onTriggerSpark={triggerSpark}
            registerEventCardRef={registerEventCardRef}
            upcomingEvent={upcomingEvent}
          />
        </div>

        <SceneMotionEffects gustKey={gustKey} spark={spark} />
      </section>
    </main>
  );
}
