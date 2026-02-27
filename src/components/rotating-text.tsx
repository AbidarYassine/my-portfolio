"use client";

import { useEffect, useMemo, useReducer, useRef, useSyncExternalStore } from "react";

const TYPING_SPEED = 80; // ms per char when typing
const DELETING_SPEED = 40; // ms per char when deleting
const HOLD_MS = 1200; // ms to hold full word before deleting

type AnimationState = "typing" | "holding" | "deleting";

interface State {
  currentIndex: number;
  display: string;
  animState: AnimationState;
}

type Action =
  | { type: "ADVANCE_DISPLAY"; nextDisplay: string }
  | { type: "TRANSITION_STATE"; nextState: AnimationState }
  | { type: "NEXT_ITEM"; itemCount: number };

function animationReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADVANCE_DISPLAY":
      return { ...state, display: action.nextDisplay };
    case "TRANSITION_STATE":
      return { ...state, animState: action.nextState };
    case "NEXT_ITEM":
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % action.itemCount,
        animState: "typing",
      };
    default:
      return state;
  }
}

export function RotatingText({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const initialDisplay = items[0] ?? "";
  const [state, dispatch] = useReducer(animationReducer, {
    currentIndex: 0,
    display: initialDisplay,
    animState: "typing",
  });

  // Track if component has mounted on client to avoid hydration mismatches
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    if (typeof globalThis !== "undefined" && typeof globalThis.matchMedia === "function") {
      prefersReducedMotion.current =
        globalThis.matchMedia("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }
  }, []);

  const widest = useMemo(() => {
    let best = "";
    for (const s of items) if (s.length > best.length) best = s;
    return best;
  }, [items]);

  const currentText = items[state.currentIndex] ?? "";

  // Animation state machine
  useEffect(() => {
    if (items.length === 0 || prefersReducedMotion.current || !isMounted) return;

    let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;

    if (state.animState === "typing") {
      if (state.display.length < currentText.length) {
        // Still typing - add next character
        timeoutId = globalThis.setTimeout(() => {
          dispatch({
            type: "ADVANCE_DISPLAY",
            nextDisplay: currentText.slice(0, state.display.length + 1),
          });
        }, TYPING_SPEED);
      } else {
        // Finished typing - transition to holding
        timeoutId = globalThis.setTimeout(() => {
          dispatch({ type: "TRANSITION_STATE", nextState: "holding" });
        }, HOLD_MS);
      }
    } else if (state.animState === "holding") {
      // Transition from holding to deleting
      timeoutId = globalThis.setTimeout(() => {
        dispatch({ type: "TRANSITION_STATE", nextState: "deleting" });
      }, 0);
    } else if (state.animState === "deleting") {
      if (state.display.length > 0) {
        // Still deleting - remove last character
        timeoutId = globalThis.setTimeout(() => {
          dispatch({
            type: "ADVANCE_DISPLAY",
            nextDisplay: currentText.slice(0, state.display.length - 1),
          });
        }, DELETING_SPEED);
      } else {
        // Finished deleting - move to next item
        dispatch({ type: "NEXT_ITEM", itemCount: items.length });
      }
    }

    return () => {
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    };
  }, [state.animState, state.display.length, currentText, items.length, isMounted]);

  // Sync display when items change
  useEffect(() => {
    if (state.currentIndex >= items.length && items.length > 0) {
      dispatch({ type: "NEXT_ITEM", itemCount: items.length });
    }
  }, [items.length, state.currentIndex]);

  return (
    <span
      className={
        "relative inline-block max-w-full align-baseline whitespace-normal break-words " +
        (className ?? "")
      }
    >
      {/* Layout stabilizer (prevents width jumps) */}
      <span aria-hidden className="invisible block max-w-full whitespace-normal break-words">
        {widest}
      </span>

      <span className="absolute inset-0 block max-w-full whitespace-normal break-words">
        <span className="block">
          {state.display}
          {/* Only render cursor after hydration to avoid mismatch */}
          {isMounted && (
            <span
              aria-hidden
              className="animate-blink ml-1 align-baseline inline-block"
              style={{
                width: 1,
                height: "1em",
                backgroundColor: "currentColor",
                marginLeft: 6,
                verticalAlign: "middle",
                opacity: 0.9,
              }}
            />
          )}
        </span>
      </span>
    </span>
  );
}
