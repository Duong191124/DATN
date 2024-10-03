import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { CloseOutlined, MessageOutlined } from "@ant-design/icons";
import { ChatService } from "../../../../service/chat.service/chat.service";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { content: "Hello!Can I help you?", sender: "bot" },
    { content: "What are you question?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typingUser, setTypingUser] = useState(false);
  const [typingBot, setTypingBot] = useState(false);
  const chatboxRef = useRef(null);

  const toggleChatBox = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = async (messageContent) => {
    const newMessage = { content: messageContent, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setTypingUser(false);
    setTypingBot(true);
    try {
      const response = await ChatService(messageContent);
      const botMessage = response.data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: botMessage, sender: "bot" },
      ]);
      setTypingBot(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: "Đã xảy ra lỗi, vui lòng thử lại.", sender: "bot" },
      ]);
      setTypingBot(false);
    }
  };
  const handleClickOutside = (event) => {
    if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={chatboxRef} className={`chatbox ${isOpen ? "open" : "closed"}`}>
      <div className="chatbox-header">
        {isOpen && (
          <div className="chat-logo">
            <img src="/image/logo.jpg" alt="Logo" />
          </div>
        )}
        {isOpen && <div className="chat-name">Hỗ trợ</div>}
        <div className="chat-icon" onClick={toggleChatBox}>
          <MessageOutlined style={{ fontSize: "24px", color: "#fff" }} />
        </div>
        {isOpen && (
          <div className="close-button" onClick={() => setIsOpen(false)}>
            <CloseOutlined style={{ fontSize: "16px", color: "#fff" }} />
          </div>
        )}
      </div>
      {isOpen && (
        <div className="chatbox-content">
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbox-message ${msg.sender}`}>
                {msg.content}
              </div>
            ))}
            {typingUser && (
              <>
                <div className="chatbox-message user"></div>
                <div className="typing-user">
                  <span className="typing-load-send">đang soạn</span>
                  <span className="typing-indicator"> ...</span>
                </div>
              </>
            )}
            {typingBot && (
              <>
                <div className="chatbox-message bot"></div>
                <div className="typing-boot">
                  ai đó đang soạn <span className="typing-indicator">...</span>
                </div>
              </>
            )}
          </div>
          <div className="chatbox-suggestions">
            <button onClick={() => sendMessage("help")}>Help</button>
            <button onClick={() => sendMessage("order problem")}>
              Order problem
            </button>
            <button onClick={() => sendMessage("support")}>Support</button>
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTypingUser(true); // Hiển thị thông báo đang soạn khi người dùng nhập
              }}
              placeholder="Nhập tin nhắn..."
              onBlur={() => setTypingUser(false)} // Ngừng hiển thị khi rời khỏi input
            />
            <button
              onClick={() => {
                sendMessage(input);
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
