import { useCallback, useEffect, useRef, useState } from "react";
import "./AskBar.css";

// Same-origin: firebase.json rewrites this to the chat function, ahead of the
// SPA catch-all. No key ships to the browser.
const CHAT_ENDPOINT = "/api/chat";

const SUGGESTIONS = [
  "why should I hire you?",
  "what are you building right now?",
  "how do I reach you?",
];

const AskBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const logEndRef = useRef(null);

  // Cmd/Ctrl+K opens the bar, Escape closes it. The collapsed state advertises
  // the shortcut, so it has to work.
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      } else if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const ask = useCallback(
    async (question) => {
      const trimmed = question.trim();
      if (!trimmed || isLoading) return;

      const history = messages.map(({ role, content }) => ({ role, content }));

      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setIsLoading(true);

      try {
        const response = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
        });

        if (!response.ok) {
          throw new Error(`chatbot responded ${response.status}`);
        }

        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Something went wrong reaching my assistant. Email zachmartim101@gmail.com and you'll get me directly.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const onSubmit = (event) => {
    event.preventDefault();
    ask(input);
  };

  if (!isOpen) {
    return (
      <div className="term-ask">
        <button
          type="button"
          className="ask-prompt"
          onClick={() => setIsOpen(true)}
        >
          <span className="ask-sigil">$ ask</span>
          <span className="ask-placeholder">
            anything about my work
            <span className="ask-caret" aria-hidden="true">
              ▋
            </span>
          </span>
          <span className="ask-key" aria-hidden="true">
            ⌘K
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="term-ask">
      <div className="ask-panel">
        <div className="ask-panel-header">
          <div className="ask-session">
            <span className="ask-dot" aria-hidden="true"></span>
            <span className="ask-title">
              ask-zach · trained on everything on this site
            </span>
          </div>
          <div className="ask-panel-actions">
            {messages.length > 0 && (
              <button
                type="button"
                className="ask-action"
                onClick={() => setMessages([])}
              >
                clear
              </button>
            )}
            <button
              type="button"
              className="ask-action"
              onClick={() => setIsOpen(false)}
            >
              esc to close
            </button>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="ask-log">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ask-turn ${
                  message.role === "assistant" ? "is-assistant" : "is-user"
                }`}
              >
                <span className="ask-role">
                  {message.role === "assistant" ? "zach" : "you"}
                </span>
                <span className="ask-text">{message.content}</span>
              </div>
            ))}
            {isLoading && (
              <div className="ask-turn is-assistant">
                <span className="ask-role">zach</span>
                <div className="ask-typing" aria-label="thinking">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        )}

        <div className="ask-suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="ask-chip"
              disabled={isLoading}
              onClick={() => ask(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form className="ask-form" onSubmit={onSubmit}>
          <span className="ask-sigil">$ ask</span>
          <input
            ref={inputRef}
            type="text"
            className="ask-input"
            placeholder="anything about my work"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="ask-send"
            disabled={isLoading || !input.trim()}
          >
            ↵ send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskBar;
