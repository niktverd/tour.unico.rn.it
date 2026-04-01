import type { CSSProperties } from "react";
import styles from "../../page.module.css";
import type { SparkState, SurpriseImageState } from "./types";

type SceneMotionEffectsProps = {
  gustKey: number;
  spark: SparkState;
  surpriseImage: SurpriseImageState | null;
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
  surpriseImage,
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

      {surpriseImage ? (
        <div
          aria-hidden="true"
          className={styles.surpriseImage}
          data-edge={surpriseImage.edge}
          data-phase={surpriseImage.phase}
          key={`surprise-${surpriseImage.key}`}
          style={getSurpriseStyle(surpriseImage)}
        >
          <img
            alt=""
            className={styles.surpriseImageAsset}
            draggable="false"
            src={surpriseImage.src}
          />
        </div>
      ) : null}
    </>
  );
}

function getSurpriseStyle(surpriseImage: SurpriseImageState) {
  const motionByEdge = {
    bottom: {
      bounceX: "0px",
      bounceY: "-18px",
      shiftX: "0px",
      shiftY: "260px",
      tilt: "7deg",
    },
    left: {
      bounceX: "16px",
      bounceY: "0px",
      shiftX: "-260px",
      shiftY: "0px",
      tilt: "-10deg",
    },
    right: {
      bounceX: "-16px",
      bounceY: "0px",
      shiftX: "260px",
      shiftY: "0px",
      tilt: "10deg",
    },
    top: {
      bounceX: "0px",
      bounceY: "18px",
      shiftX: "0px",
      shiftY: "-260px",
      tilt: "-7deg",
    },
  } as const;
  const motion = motionByEdge[surpriseImage.edge];

  return {
    "--surprise-bounce-x": motion.bounceX,
    "--surprise-bounce-y": motion.bounceY,
    "--surprise-left": `${surpriseImage.x}%`,
    "--surprise-rotation": `${surpriseImage.rotation}deg`,
    "--surprise-shift-x": motion.shiftX,
    "--surprise-shift-y": motion.shiftY,
    "--surprise-tilt": motion.tilt,
    "--surprise-top": `${surpriseImage.y}%`,
  } as CSSProperties;
}
