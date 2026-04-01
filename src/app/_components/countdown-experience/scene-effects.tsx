import styles from "../../page.module.css";
import type { SparkState } from "./types";

type SceneMotionEffectsProps = {
  gustKey: number;
  spark: SparkState;
};

export function SceneBackdrop() {
  return (
    <>
      <div aria-hidden="true" className={styles.imageLayer} />
      <div aria-hidden="true" className={styles.skyGlow} />
      <div aria-hidden="true" className={styles.skyPattern} />
      <div aria-hidden="true" className={styles.floatingOrb} />
    </>
  );
}

export function SceneMotionEffects({
  gustKey,
  spark,
}: SceneMotionEffectsProps) {
  return (
    <>
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
    </>
  );
}
