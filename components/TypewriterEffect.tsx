"use client";

import { useEffect, useMemo, useState } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypewriterEffect({
  words,
  typingSpeed = 100,
  erasingSpeed = 50,
  pauseDuration = 2000,
  className = "",
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const longestLength = useMemo(
    () => words.reduce((max, w) => Math.max(max, w.length), 0),
    [words]
  );

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentWord.length) {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        } else {
          pauseTimer = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? erasingSpeed : typingSpeed);

    return () => {
      clearTimeout(timeout);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [displayedText, isDeleting, currentWordIndex, words, typingSpeed, erasingSpeed, pauseDuration]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: `${Math.max(longestLength, 1)}ch`,
        minWidth: `${Math.max(longestLength, 1)}ch`,
        whiteSpace: "nowrap",
        lineHeight: 1.15,
        textAlign: "center",
        overflowAnchor: "none",
      }}
      aria-live="polite"
    >
      {displayedText || "\u00A0"}
    </span>
  );
}