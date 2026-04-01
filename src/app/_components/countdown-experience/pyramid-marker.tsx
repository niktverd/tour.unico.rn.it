import styles from "../../page.module.css";

export function PyramidMarker() {
  return (
    <svg
      aria-hidden="true"
      className={styles.pyramidMarker}
      viewBox="0 0 80 56"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        className={styles.pyramidSand}
        d="M2 49c6-4 10-4 15 0 4 3 8 3 13-1 5-4 11-4 16 0 4 3 8 3 12 0 5-4 10-4 15 0 3 2 5 2 5 2v4H2Z"
      />
      <path
        className={styles.pyramidBack}
        d="M48 43 63 18l14 25Z"
      />
      <path
        className={styles.pyramidLeft}
        d="M9 43 25 18l16 25Z"
      />
      <path
        className={styles.pyramidCenter}
        d="M24 43 42 10l19 33Z"
      />
      <path
        className={styles.pyramidStroke}
        d="M24 43 42 10l19 33M9 43 25 18l16 25M48 43 63 18l14 25"
      />
      <path
        className={styles.pyramidLines}
        d="M18 34h11M15 39h16M32 24h8M29 30h17M36 36h20M54 30h10M57 36h13"
      />
    </svg>
  );
}
