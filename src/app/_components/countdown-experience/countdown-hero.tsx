import styles from "../../page.module.css";
import type { CountdownPart, EventState, VacationEvent } from "./types";

type CountdownHeroProps = {
  countdownParts: CountdownPart[];
  detailsOpen: boolean;
  eventState: EventState;
  focusedEvent: VacationEvent;
  onToggleDetails: (timestamp: number) => void;
};

export function CountdownHero({
  countdownParts,
  detailsOpen,
  eventState,
  focusedEvent,
  onToggleDetails,
}: CountdownHeroProps) {
  const [daysPart, ...timeParts] = countdownParts;

  return (
    <section className={styles.hero} data-state={eventState}>
      <button
        aria-expanded={detailsOpen}
        className={styles.eventButton}
        onClick={(event) => {
          onToggleDetails(event.timeStamp);
        }}
        type="button"
      >
        <h1 className={styles.eventName}>{focusedEvent.name}</h1>
        <span
          aria-hidden="true"
          className={styles.eventChevron}
          data-open={detailsOpen}
        >
          +
        </span>
      </button>

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

      <div className={styles.storyWrap} data-open={detailsOpen}>
        <div className={styles.storyRail}>
          <p className={styles.storyCard}>{focusedEvent.description}</p>
        </div>
      </div>
    </section>
  );
}
