// The boot terminal at /. Types four install lines, then hands straight to the
// landing page.
//
// It used to open a fake Chrome window containing a name animation and a "Get
// Started" button, so a visitor watched the terminal and then had to click
// before seeing any portfolio content. The terminal stays; the click does not.
//
// Markup matches the .desktop-screen / .terminal-* rules already in
// styles/global.css, so no stylesheet of its own.

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  "Initializing...",
  "Downloading dependencies...",
  "Installing packages...",
  "Starting application...",
];

const STEP_MS = 300;
const HAND_OFF_MS = 400;

export const Boot = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const timers = useRef([]);

  // replace: true so the back button leaves the site rather than replaying the
  // intro the visitor has already sat through.
  const toLanding = () => navigate("/landing", { replace: true });

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // An animation standing between a visitor and the content has to be
    // skippable for anyone who has asked not to be animated at.
    if (reduce) {
      navigate("/landing", { replace: true });
      return undefined;
    }

    let index = 0;
    const tick = setInterval(() => {
      if (index < STEPS.length) {
        // Read the step before incrementing. The updater below runs during
        // render, not here, and closes over `index` by reference -- so
        // reading STEPS[index] inside it saw the already-incremented value.
        // That silently skipped "Downloading dependencies..." and appended a
        // trailing undefined, which rendered as an empty line.
        const step = STEPS[index];
        setMessages((prev) => [...prev, step]);
        index += 1;
        return;
      }
      clearInterval(tick);
      const handOff = setTimeout(
        () => navigate("/landing", { replace: true }),
        HAND_OFF_MS
      );
      timers.current.push(handOff);
    }, STEP_MS);
    timers.current.push(tick);

    return () => {
      timers.current.forEach((t) => {
        clearInterval(t);
        clearTimeout(t);
      });
      timers.current = [];
    };
  }, [navigate]);

  return (
    <div className="desktop-screen">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="mac-controls">
            {/* Closing the terminal used to leave a blank screen. It now does
                what a visitor in a hurry means by it. */}
            <button className="red" onClick={toLanding} aria-label="Skip intro" />
            <button className="yellow" aria-hidden="true" />
            <button className="green" aria-hidden="true" />
          </div>
          Terminal
        </div>
        <div className="terminal-body">
          {messages.map((msg) => (
            <div key={msg} className="terminal-line">
              zachmartim@Macbook-Pro-123 Desktop % {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boot;
