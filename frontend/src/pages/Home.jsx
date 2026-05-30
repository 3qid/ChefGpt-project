import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuthContext();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasFetched = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user && user.token && !hasFetched.current) {
      fetchChats();
      hasFetched.current = true;
    }
    return () => { hasFetched.current = false; };
  }, [user]);

  useEffect(() => {
    if (selectedChat && inputRef.current) inputRef.current.focus();
  }, [selectedChat]);

  const fetchChats = async () => {
    if (!user || !user.token) return;
    try {
      const res = await fetch("http://localhost:3000/api/chats", {
        method: "GET",
        headers: { authorization: `Bearer ${user.token}` }
      });
      if (res.status === 401) return;
      const data = await res.json();
      if (res.ok) {
        setChats(data);
        if (selectedChat) {
          const updated = data.find(c => c._id === selectedChat._id);
          if (updated) setSelectedChat(updated);
        }
      }
    } catch (err) { console.error(err); }
  };

  const createNewChat = async (prompt) => {
    const res = await fetch("http://localhost:3000/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (res.ok) {
      setChats(prev => [data, ...prev]);
      setSelectedChat(data);
      setSidebarOpen(false);
    }
    return data;
  };

  const handleSend = async () => {
    if (!input.trim() || !user || !user.token) return;
    const userMessage = input;
    setInput("");
    setLoading(true);

    if (!selectedChat) {
      await createNewChat(userMessage);
      setLoading(false);
      return;
    }

    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, { role: "user", text: userMessage, _temp: true }]
    }));

    try {
      const res = await fetch(`http://localhost:3000/api/chats/${selectedChat._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ text: userMessage })
      });
      if (res.ok) {
        const updatedChat = await res.json();
        setSelectedChat(updatedChat);
        hasFetched.current = false;
        await fetchChats();
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="home-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <Sidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={(chat) => { setSelectedChat(chat); setSidebarOpen(false); }}
        />
      </div>
      <div className="main-area">
        <div className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(prev => !prev)}>☰</button>
          <span className="chat-title">{selectedChat?.title || "Start a conversation"}</span>
        </div>
        <ChatWindow selectedChat={selectedChat} loading={loading} />
        <MessageInput input={input} setInput={setInput} onSend={handleSend} loading={loading} inputRef={inputRef} />
        <p className="chat-disclaimer">
          ChefGPT is an AI assistant and may occasionally provide inaccurate or incomplete information.
          Always use your best judgment when preparing food and consult reliable sources for dietary and safety concerns.
        </p>
      </div>
    </div>
  );
};

export default Home;
