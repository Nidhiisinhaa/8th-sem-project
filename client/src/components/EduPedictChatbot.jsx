import { useState, useRef, useEffect } from "react";
import "./EduPedictChatbot.css";
import mascotImg from "../assets/mascot.png";

// ─── Static Knowledge Base ──────────────────────────────────────────────────

const QUICK_BUTTONS = [
  { id: "study",         label: " Ways to Study" },
  { id: "grade",         label: " Grade Prediction Logic" },
  { id: "risk",          label: " Risk Score" },
  { id: "contact",       label: " Contact Us" },
  { id: "concentration", label: " Ways to Increase Concentration" },
];

const STATIC_RESPONSES = {
  study: `Here are some proven methods to study better:\n\n• **Spaced Repetition** – Review material at increasing intervals (e.g., after 1 day, 3 days, 1 week) to boost long-term retention.\n• **Active Recall** – Test yourself instead of re-reading. Use flashcards, practice questions, or explain concepts out loud.\n• **Pomodoro Technique** – Study in focused 25-minute blocks, followed by a 5-minute break. After 4 cycles, take a longer break.\n• **The Feynman Technique** – Teach the concept in simple words as if explaining to a 10-year-old — gaps in understanding become obvious quickly.\n• **Mind Mapping** – Visually organize topics in a branching diagram to see connections between ideas.\n• **Interleaving** – Mix different subjects or problem types in one session instead of massing one topic. Improves discrimination between concepts.`,

  grade: `EduPredict calculates your predicted grade using a combination of factors:\n\n• **Past Academic Performance (40%)** – Your historical scores, assignments, and quiz results form the strongest predictor of future performance.\n• **Current Attendance (25%)** – Consistent attendance correlates strongly with engagement and outcomes. Missing classes contributes to grade drops.\n• **Assignment Submission Rate (20%)** – Regular, on-time submissions indicate discipline and steady engagement with the material.\n• **Participation & Engagement (10%)** – Activity on the platform, forum participation, and in-class interactions are factored in.\n• **Recent Trend (5%)** – Whether your scores are improving or declining recently fine-tunes the final prediction.\n\nAll factors are weighted and fed into our ML model to produce a projected final grade with a confidence interval.`,

  risk: `Your Risk Score is a number from 0–100 that indicates how likely you are to underperform or fail a course.\n\n• **0–30 (Low Risk 🟢)** – You're on track. Keep up the good work!\n• **31–60 (Moderate Risk 🟡)** – Some warning signs detected. Consider reviewing attendance or catching up on assignments.\n• **61–100 (High Risk 🔴)** – Immediate attention needed. The system will suggest specific interventions.\n\nThe score is recalculated weekly based on updated data such as attendance, recent scores, and submission patterns. Early alerts allow you — and your instructors — to act before it's too late.`,

  concentration: `Struggling to focus? Here are evidence-backed ways to build better concentration:\n\n• **Single-Tasking** – Close extra tabs, put your phone on Do Not Disturb, and focus on only one task at a time.\n• **Environment Design** – Study in a clean, well-lit space. Keep your desk clutter-free. Your environment shapes your focus.\n• **Scheduled Breaks** – Short, intentional breaks prevent mental fatigue. Step outside or stretch briefly every 30–45 minutes.\n• **Digital Detox Hours** – Designate screen-free study windows, especially during deep work sessions.\n• **Sleep & Nutrition** – 7–8 hours of sleep dramatically improves memory consolidation. Stay hydrated and avoid heavy meals before studying.\n• **Background Sound** – Some students focus better with soft instrumental music or brown noise. Try apps like Brain.fm or a lo-fi playlist.`,

  contact: `You can reach out to the EduPredict team through the following:\n\n📱 **Phone / WhatsApp**\n+91 88006 59769 (Nidhi Sinha)\n\n📧 **Email**\nedupredict@gmail.com\n\nWe typically respond within 24 hours on weekdays. For urgent queries, WhatsApp is the fastest way to reach us!`,
};

// ─── Message Renderer (bold support) ────────────────────────────────────────

function renderMessage(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  const isBot = msg.from === "bot";
  const lines = msg.text.split("\n");

  return (
    <div className={`edu-msg-row ${isBot ? "bot" : "user"}`}>
      <div className={`edu-bubble ${isBot ? "bot" : "user"}`}>
        {lines.map((line, i) => (
          <span key={i}>
            {renderMessage(line)}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
        <div className="edu-bubble-time">{msg.time}</div>
      </div>
    </div>
  );
}

// ─── Main Chatbot Component ──────────────────────────────────────────────────

export default function EduPredictChatbot() {
  const [open, setOpen]         = useState(false);
  const [started, setStarted]   = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef(null);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addMessage = (text, from) => {
    setMessages((prev) => [
      ...prev,
      { text, from, time: now(), id: Date.now() + Math.random() },
    ]);
  };

  const handleStart = () => {
    setStarted(true);
    addMessage(
      "Hi! 👋 I'm your EduPredict assistant.\nAsk me anything about your academic journey, or tap a quick topic below!",
      "bot"
    );
  };

  const handleQuickButton = (id) => {
    const btn = QUICK_BUTTONS.find((b) => b.id === id);
    addMessage(btn.label, "user");
    setTimeout(() => addMessage(STATIC_RESPONSES[id], "bot"), 400);
  };

  const handleSend = async () => {
    const query = input.trim();
    if (!query || loading) return;
    setInput("");
    addMessage(query, "user");
    setLoading(true);

    // Keyword matching → static answers
    const lower = query.toLowerCase();
    let staticHit = null;
    if (lower.includes("study") || lower.includes("learn") || lower.includes("method"))
      staticHit = "study";
    else if (lower.includes("grade") || lower.includes("predict"))
      staticHit = "grade";
    else if (lower.includes("risk"))
      staticHit = "risk";
    else if (lower.includes("concentrat") || lower.includes("focus") || lower.includes("attention"))
      staticHit = "concentration";
    else if (lower.includes("contact") || lower.includes("email") || lower.includes("phone"))
      staticHit = "contact";

    if (staticHit) {
      setTimeout(() => {
        setLoading(false);
        addMessage(STATIC_RESPONSES[staticHit], "bot");
      }, 500);
      return;
    }

    // ── Friend's backend ──────────────────────────────────────────
    // When your friend deploys her API, add this to your .env file:
    //   VITE_CHATBOT_API_URL=https://her-api-url.com/query
    const API_URL = import.meta.env?.VITE_CHATBOT_API_URL || null;

    if (!API_URL) {
      setLoading(false);
      addMessage(
        "I don't have a specific answer for that yet! Our full AI backend is coming soon. 🚀\nFor now, try the quick-topic buttons above or contact us at edupredict@gmail.com.",
        "bot"
      );
      return;
    }

    try {
      const res  = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      const reply = data.answer || data.response || data.result || "I couldn't find an answer for that.";
      setLoading(false);
      addMessage(reply, "bot");
    } catch {
      setLoading(false);
      addMessage(
        "Hmm, I couldn't reach the server right now. Please try again later or email us at edupredict@gmail.com.",
        "bot"
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="edu-wrapper">

      {/* Floating mascot button */}
      <div
        className="edu-mascot"
        onClick={() => setOpen((v) => !v)}
        title="Ask EduPredict"
      >
        <img src={mascotImg} alt="EduPredict mascot" />
      </div>

      {/* Chat window */}
      {open && (
        <div className="edu-window">

          {/* Header */}
          <div className="edu-header">
            <img src={mascotImg} alt="mascot" className="edu-header-img" />
            <div className="edu-header-text">
              <p className="edu-header-title">EduPredict Assistant</p>
              <p className="edu-header-sub">🟢 Online — always here to help</p>
            </div>
            <button className="edu-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Welcome screen */}
          {!started ? (
            <div className="edu-welcome">
              <img src={mascotImg} alt="mascot large" className="edu-welcome-img" />
              <p className="edu-welcome-title">Welcome to EduPredict!</p>
              <p className="edu-welcome-sub">
                Hi, I'm your smart academic assistant.{"\n"}
                Ask me anything about grades, study tips, and more!
              </p>
              <button className="edu-start-btn" onClick={handleStart}>
                GET STARTED
              </button>
            </div>
          ) : (
            <>
              {/* Quick topic buttons */}
              <div className="edu-quick-btns">
                {QUICK_BUTTONS.map((btn) => (
                  <button
                    key={btn.id}
                    className="edu-qbtn"
                    onClick={() => handleQuickButton(btn.id)}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="edu-chat-area">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
                {loading && (
                  <div className="edu-typing-dots">
                    <span className="edu-dot" />
                    <span className="edu-dot" />
                    <span className="edu-dot" />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="edu-input-row">
                <input
                  className="edu-input"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="edu-send-btn"
                  onClick={handleSend}
                  disabled={loading}
                  title="Send"
                >
                  ➤
                </button>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}