import { useState, useEffect } from "react";

export const useTimer = (initialTime: number) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const resetTimer = (newTime: number) => setTime(newTime);

  return { time, resetTimer };
};
