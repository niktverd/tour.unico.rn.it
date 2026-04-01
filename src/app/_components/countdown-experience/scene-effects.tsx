import type { CSSProperties } from "react";
import styles from "../../page.module.css";
import type { SparkState } from "./types";

type SceneMotionEffectsProps = {
  gustKey: number;
  spark: SparkState;
};

type SceneBackdropProps = {
  activeImage: string;
  fadingImage: string | null;
};

export function SceneBackdrop({
  activeImage,
  fadingImage,
}: SceneBackdropProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`${styles.imageLayer} ${styles.imageLayerCurrent}`}
        style={
          {
            "--scene-image": `url("${activeImage}")`,
          } as CSSProperties
        }
      />
      {fadingImage ? (
        <div
          aria-hidden="true"
          className={`${styles.imageLayer} ${styles.imageLayerFade}`}
          style={
            {
              "--scene-image": `url("${fadingImage}")`,
            } as CSSProperties
          }
        />
      ) : null}
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
