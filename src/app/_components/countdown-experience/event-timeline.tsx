import type { CSSProperties } from "react";
import styles from "../../page.module.css";
import { getEventState, getTimelineDateParts } from "./helpers";
import { PyramidMarker } from "./pyramid-marker";
import type { EventState, VacationEvent } from "./types";

type EventTimelineProps = {
  eventState: EventState;
  events: VacationEvent[];
  focusedEventId: string;
  onSelectEvent: (event: VacationEvent) => void;
  onTriggerSpark: () => void;
  registerTimelineRef: (element: HTMLElement | null) => void;
  registerEventCardRef: (
    eventId: string,
    element: HTMLButtonElement | null,
  ) => void;
  upcomingEvent: VacationEvent | null;
};

export function EventTimeline({
  eventState,
  events,
  focusedEventId,
  onSelectEvent,
  onTriggerSpark,
  registerTimelineRef,
  registerEventCardRef,
  upcomingEvent,
}: EventTimelineProps) {
  return (
    <nav
      aria-label="Маршрут по поездке"
      className={styles.timeline}
      data-state={eventState}
      ref={registerTimelineRef}
    >
      <div className={styles.eventCardRow}>
        {events.map((event) => {
          const state = getEventState(event, upcomingEvent);
          const isFocused = event.id === focusedEventId;
          const date = getTimelineDateParts(event.startsAt);

          return (
            <button
              aria-label={`${event.name}, ${date.day} ${date.month}`}
              className={styles.eventCard}
              data-focused={isFocused}
              data-state={state}
              key={event.id}
              onClick={() => {
                onSelectEvent(event);
                onTriggerSpark();
              }}
              ref={(element) => {
                registerEventCardRef(event.id, element);
              }}
              style={
                {
                  "--event-card-image": `url("${event.image}")`,
                } as CSSProperties
              }
              type="button"
            >
              <span aria-hidden="true" className={styles.eventCardImage} />
              {state === "next" ? (
                <span className={styles.eventCardNext}>
                  <PyramidMarker />
                </span>
              ) : null}
              <span className={styles.eventCardDate}>
                <span className={styles.eventCardDay}>{date.day}</span>
                <span className={styles.eventCardMonth}>{date.month}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
