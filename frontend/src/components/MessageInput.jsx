const MessageInput = ({ input, setInput, onSend, loading, inputRef }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) onSend();
  };

  return (
    <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border-color)" }}>
      <div className="input-container" style={{
        display: "flex",
        alignItems: "center",
        background: "var(--input-bg)",
        borderRadius: "30px",
        padding: "6px 6px 6px 16px",
        border: "2px solid var(--border-color)",
        transition: "border-color 0.2s",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a recipe..."
          disabled={loading}
          className="msg-input"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "14px"
          }}
        />
        <button
          onClick={onSend}
          disabled={loading || !input.trim()}
          className="send-btn"
          style={{
            background: input.trim() ? "var(--accent-color)" : "#555",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: input.trim() ? "pointer" : "default",
            color: "#fff",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, transform 0.1s",
            transform: input.trim() ? "scale(1)" : "scale(0.9)",
            opacity: input.trim() ? 1 : 0.5,
            flexShrink: 0
          }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .input-container { padding: 5px 5px 5px 14px !important; }
          .msg-input { font-size: 13px !important; }
          .send-btn { width: 34px !important; height: 34px !important; font-size: 14px !important; }
        }
        @media (max-width: 480px) {
          .input-container { padding: 4px 4px 4px 12px !important; border-radius: 25px !important; }
          .msg-input { font-size: 13px !important; }
        }
      `}</style>
    </div>
  );
};

export default MessageInput;
