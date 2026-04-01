import {
  startTransition,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { DEFAULT_SPARK_POSITION } from "./constants";
import { clamp } from "./helpers";
import type { SparkState } from "./types";

export function useSceneInteractions() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const lastInteractionAt = useRef(0);
  const [gustKey, setGustKey] = useState(0);
  const [spark, setSpark] = useState<SparkState>({
    key: 0,
    ...DEFAULT_SPARK_POSITION,
  });

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

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    updatePointerPosition(event.clientX, event.clientY);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    updatePointerPosition(event.clientX, event.clientY);
    triggerSpark(event.clientX, event.clientY);
  }

  function handleTouchStart(event: ReactTouchEvent<HTMLElement>) {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    updatePointerPosition(touch.clientX, touch.clientY);
    triggerSpark(touch.clientX, touch.clientY);
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
    triggerGust,
    triggerSpark,
  };
}
