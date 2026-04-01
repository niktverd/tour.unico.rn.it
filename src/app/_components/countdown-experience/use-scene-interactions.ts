import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  DEFAULT_SPARK_POSITION,
  SURPRISE_EDGES,
  SURPRISE_HIDE_DURATION_MS,
  SURPRISE_IMAGE_SOURCES,
  SURPRISE_VISIBLE_DURATION_MS,
  TRIPLE_TAP_DISTANCE_PX,
  TRIPLE_TAP_WINDOW_MS,
} from "./constants";
import { clamp } from "./helpers";
import type { SparkState, SurpriseEdge, SurpriseImageState } from "./types";

type TapRecord = {
  pointerType: "mouse" | "pen" | "touch";
  timestamp: number;
  x: number;
  y: number;
};

export function useSceneInteractions() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const surpriseImageRef = useRef<SurpriseImageState | null>(null);
  const surpriseKeyRef = useRef(0);
  const surpriseAutoHideTimeoutRef = useRef<number | null>(null);
  const surpriseHideTimeoutRef = useRef<number | null>(null);
  const tapHistoryRef = useRef<TapRecord[]>([]);
  const lastInteractionAt = useRef(0);
  const [gustKey, setGustKey] = useState(0);
  const [spark, setSpark] = useState<SparkState>({
    key: 0,
    ...DEFAULT_SPARK_POSITION,
  });
  const [surpriseImage, setSurpriseImage] = useState<SurpriseImageState | null>(
    null,
  );

  useEffect(() => {
    surpriseImageRef.current = surpriseImage;
  }, [surpriseImage]);

  useEffect(() => {
    return () => {
      if (surpriseAutoHideTimeoutRef.current !== null) {
        window.clearTimeout(surpriseAutoHideTimeoutRef.current);
      }

      if (surpriseHideTimeoutRef.current !== null) {
        window.clearTimeout(surpriseHideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!surpriseImage || surpriseImage.phase !== "visible") {
      return;
    }

    if (surpriseAutoHideTimeoutRef.current !== null) {
      window.clearTimeout(surpriseAutoHideTimeoutRef.current);
    }

    surpriseAutoHideTimeoutRef.current = window.setTimeout(() => {
      hideSurpriseImage();
    }, SURPRISE_VISIBLE_DURATION_MS);

    return () => {
      if (surpriseAutoHideTimeoutRef.current !== null) {
        window.clearTimeout(surpriseAutoHideTimeoutRef.current);
        surpriseAutoHideTimeoutRef.current = null;
      }
    };
  }, [surpriseImage]);

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

  function shouldAnimate(timestamp: number) {
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

  function triggerGust(timestamp: number) {
    if (!shouldAnimate(timestamp)) {
      return;
    }

    startTransition(() => {
      setGustKey((current) => current + 1);
    });
  }

  function clearSurpriseAutoHideTimeout() {
    if (surpriseAutoHideTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(surpriseAutoHideTimeoutRef.current);
    surpriseAutoHideTimeoutRef.current = null;
  }

  function clearSurpriseHideTimeout() {
    if (surpriseHideTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(surpriseHideTimeoutRef.current);
    surpriseHideTimeoutRef.current = null;
  }

  function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
  }

  function pickRandomValue<T>(values: readonly T[]) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function getSurpriseRotation(edge: SurpriseEdge) {
    if (edge === "left") {
      return randomBetween(-20, -8);
    }

    if (edge === "right") {
      return randomBetween(8, 20);
    }

    return randomBetween(-14, 14);
  }

  function getSurpriseX(edge: SurpriseEdge) {
    if (edge === "left") {
      return randomBetween(6, 12);
    }

    if (edge === "right") {
      return randomBetween(88, 94);
    }

    return randomBetween(22, 78);
  }

  function getSurpriseY(edge: SurpriseEdge) {
    if (edge === "top") {
      return randomBetween(8, 16);
    }

    if (edge === "bottom") {
      return randomBetween(84, 91);
    }

    return randomBetween(20, 78);
  }

  function createSurpriseImage(): SurpriseImageState {
    const edge = pickRandomValue(SURPRISE_EDGES);
    const src = pickRandomValue(SURPRISE_IMAGE_SOURCES);

    surpriseKeyRef.current += 1;

    return {
      edge,
      key: surpriseKeyRef.current,
      phase: "visible",
      rotation: getSurpriseRotation(edge),
      src,
      x: getSurpriseX(edge),
      y: getSurpriseY(edge),
    };
  }

  function hideSurpriseImage() {
    const currentImage = surpriseImageRef.current;

    if (!currentImage || currentImage.phase === "leaving") {
      return;
    }

    clearSurpriseAutoHideTimeout();
    clearSurpriseHideTimeout();

    startTransition(() => {
      setSurpriseImage({
        ...currentImage,
        phase: "leaving",
      });
    });

    surpriseHideTimeoutRef.current = window.setTimeout(() => {
      setSurpriseImage(null);
      surpriseHideTimeoutRef.current = null;
    }, SURPRISE_HIDE_DURATION_MS);
  }

  function toggleSurpriseImage() {
    if (surpriseImageRef.current) {
      hideSurpriseImage();
      return;
    }

    clearSurpriseAutoHideTimeout();
    clearSurpriseHideTimeout();

    startTransition(() => {
      setSurpriseImage(createSurpriseImage());
    });
  }

  function registerTap(
    pointerType: TapRecord["pointerType"],
    clientX: number,
    clientY: number,
    timestamp: number,
  ) {
    const recentTaps = tapHistoryRef.current.filter(
      (tap) =>
        tap.pointerType === pointerType &&
        timestamp - tap.timestamp <= TRIPLE_TAP_WINDOW_MS,
    );
    const lastTap = recentTaps[recentTaps.length - 1];
    const currentTap: TapRecord = {
      pointerType,
      timestamp,
      x: clientX,
      y: clientY,
    };

    if (lastTap) {
      const travelDistance = Math.hypot(
        lastTap.x - clientX,
        lastTap.y - clientY,
      );

      tapHistoryRef.current =
        travelDistance <= TRIPLE_TAP_DISTANCE_PX
          ? [...recentTaps, currentTap]
          : [currentTap];
    } else {
      tapHistoryRef.current = [currentTap];
    }

    if (tapHistoryRef.current.length < 3) {
      return;
    }

    tapHistoryRef.current = [];
    toggleSurpriseImage();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    updatePointerPosition(event.clientX, event.clientY);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    updatePointerPosition(event.clientX, event.clientY);
    triggerSpark(event.clientX, event.clientY);
    registerTap(
      event.pointerType === "pen" ? "pen" : "mouse",
      event.clientX,
      event.clientY,
      event.timeStamp,
    );
  }

  function handleTouchStart(event: ReactTouchEvent<HTMLElement>) {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    updatePointerPosition(touch.clientX, touch.clientY);
    triggerSpark(touch.clientX, touch.clientY);
    registerTap("touch", touch.clientX, touch.clientY, event.timeStamp);
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

    triggerGust(event.timeStamp);
  }

  function handleWheel(event: ReactWheelEvent<HTMLElement>) {
    if (event.cancelable) {
      event.preventDefault();
    }

    triggerGust(event.timeStamp);
  }

  return {
    gustKey,
    handlePointerDown,
    handlePointerMove,
    handleTouchMove,
    handleTouchStart,
    handleWheel,
    resetPointerPosition,
    sceneRef,
    spark,
    surpriseImage,
    triggerGust,
    triggerSpark,
  };
}
