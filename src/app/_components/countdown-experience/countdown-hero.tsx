import styles from "../../page.module.css";
import type { CountdownPart, EventState, VacationEvent } from "./types";

type CountdownHeroProps = {
  countdownParts: CountdownPart[];
  eventState: EventState;
  focusedEvent: VacationEvent;
  localEventDateTime: string | null;
};

export function CountdownHero({
  countdownParts,
  eventState,
  focusedEvent,
  localEventDateTime,
}: CountdownHeroProps) {
  const [daysPart, ...timeParts] = countdownParts;

  return (
    <section className={styles.hero} data-state={eventState}>
      <header className={styles.eventHeader}>
        <h1 className={styles.eventName}>{focusedEvent.name}</h1>
      </header>

      <div className={styles.countdownStage}>
        <div className={styles.daysBlock}>
          <span
            className={styles.daysValue}
            key={`days-${focusedEvent.id}-${daysPart.value}`}
          >
            {daysPart.value}
          </span>
        </div>

        <div className={styles.timeStrip}>
          {timeParts.map((part, index) => (
            <span className={styles.timeChip} key={part.label}>
              <span
                className={styles.timeValue}
                key={`${focusedEvent.id}-${part.label}-${part.value}`}
              >
                {part.value}
              </span>
              {index < timeParts.length - 1 ? (
                <span aria-hidden="true" className={styles.timeDivider}>
                  :
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.eventMeta}>
        <p className={styles.eventPlace}>{focusedEvent.place}</p>
        <time
          className={styles.eventLocalTime}
          dateTime={focusedEvent.startsAt}
          suppressHydrationWarning
        >
          {localEventDateTime ?? ""}
        </time>
      </div>

      <div className={styles.storyWrap}>
        <div className={styles.storyRail}>
          <p className={styles.storyCard}>{focusedEvent.description}</p>
        </div>
      </div>
    </section>
  );
}
