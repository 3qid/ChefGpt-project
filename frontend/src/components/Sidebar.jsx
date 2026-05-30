import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import UserProfile from "./UserProfile";

const Sidebar = ({ chats, selectedChat, onSelectChat }) => {
  const { user } = useAuthContext();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--sidebar-bg)"
      }}>
        <div style={{ padding: "15px", overflowY: "auto", flex: 1 }}>
          <h3 style={{
            color: "var(--text-secondary)",
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "15px",
            marginTop: 0
          }}>
            Chats
          </h3>
          {chats.map(chat => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              style={{
                padding: "12px",
                marginBottom: "4px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "13px",
                color: "var(--text-primary)",
                background: selectedChat?._id === chat._id ? "var(--active-bg)" : "transparent",
                borderLeft: selectedChat?._id === chat._id ? "3px solid var(--accent-color)" : "3px solid transparent",
                transition: "background 0.15s"
              }}
              onMouseEnter={(e) => {
                if (selectedChat?._id !== chat._id) e.currentTarget.style.background = "var(--active-bg)";
              }}
              onMouseLeave={(e) => {
                if (selectedChat?._id !== chat._id) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: selectedChat?._id === chat._id ? 600 : 400
              }}>
                {chat.title || "New Chat"}
              </div>
              {chat.messages?.length > 0 && (
                <div style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {chat.messages[chat.messages.length - 1]?.text?.substring(0, 40)}...
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          onClick={() => setShowProfile(true)}
          style={{
            padding: "12px 15px",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            transition: "background 0.15s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--active-bg)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: "36px", height: "36px",
            borderRadius: "50%",
            background: "var(--accent-color)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "bold", fontSize: "16px",
            flexShrink: 0
          }}>
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {user?.name || user?.email?.split("@")[0] || "User"}
            </div>
          </div>
        </div>
      </div>

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Sidebar;
