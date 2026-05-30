import ReactMarkdown from "react-markdown";

const ChatWindow = ({ selectedChat, loading }) => {
  return (
    <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
      {selectedChat?.messages?.map((msg, i) => (
        <div key={i} style={{
          display: "flex",
          justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          marginBottom: "10px"
        }}>
          <div className="msg-bubble" style={{
            maxWidth: "70%",
            padding: "10px 14px",
            borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: msg.role === "user" ? "var(--user-msg-bg)" : "var(--ai-msg-bg)",
            color: msg.role === "user" ? "var(--user-msg-text)" : "var(--ai-msg-text)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}>
            {msg.role === "ai" ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={{ margin: "0 0 6px 0", lineHeight: 1.5, fontSize: "14px" }}>{children}</p>,
                  ul: ({ children }) => <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ margin: "4px 0", paddingLeft: "16px" }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: "3px", fontSize: "14px" }}>{children}</li>,
                  strong: ({ children }) => <strong style={{ color: "var(--text-primary)" }}>{children}</strong>,
                  code: ({ children }) => <code style={{ background: "var(--code-bg)", padding: "1px 5px", borderRadius: "4px", fontSize: "13px" }}>{children}</code>,
                  pre: ({ children }) => <pre style={{ background: "var(--code-bg)", padding: "10px", borderRadius: "8px", overflowX: "auto", fontSize: "13px" }}>{children}</pre>,
                  h1: ({ children }) => <h1 style={{ fontSize: "18px", margin: "10px 0 6px" }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontSize: "16px", margin: "8px 0 4px" }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: "14px", margin: "6px 0 4px" }}>{children}</h3>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              <p style={{ margin: 0, fontSize: "14px" }}>{msg.text}</p>
            )}
            {!msg._temp && (
              <span style={{ fontSize: "9px", opacity: 0.5, display: "block", marginTop: "4px" }}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
          <div style={{
            padding: "14px 18px",
            borderRadius: "18px 18px 18px 4px",
            background: "var(--ai-msg-bg)",
            display: "flex",
            gap: "5px",
            alignItems: "center"
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--text-secondary)", animation: "bounce 1.4s infinite ease-in-out both" }} />
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--text-secondary)", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.16s" }} />
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--text-secondary)", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.32s" }} />
          </div>
        </div>
      )}

      {!selectedChat && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          height: "100%", opacity: 0.4, gap: "10px",
          padding: "20px", textAlign: "center"
        }}>
          <span style={{ fontSize: "40px" }}>🍳</span>
          <p style={{ margin: 0, fontSize: "14px" }}>Ask about recipes, cooking tips, or meal ideas</p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .msg-bubble { max-width: 85% !important; }
        }
        @media (max-width: 480px) {
          .msg-bubble { max-width: 90% !important; }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
