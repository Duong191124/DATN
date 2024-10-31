import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { CloseOutlined, MessageOutlined } from "@ant-design/icons";
import { ChatService } from "../../../../service/chat.service/chat.service";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { content: "Hello!Can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typingUser, setTypingUser] = useState(false);
  const [typingBot, setTypingBot] = useState(false);
  const chatboxRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("scroll: ")
  };

  const toggleChatBox = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = async (messageContent) => {
    scrollToBottom();
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
        { content: "Something went wrong, try again", sender: "bot" },
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
        {isOpen && <div className="chat-name">Bot assistant</div>}
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
          <div
            className="chatbox-messages"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`chatbox-message ${msg.sender}`}>
                {msg.content}
              </div>
            ))}
            {typingUser && (
              <>
                <div className="typing-user">
                  <span className="typing-load-send">texting</span>
                  <span className="typing-indicator"> ...</span>
                </div>
              </>
            )}
            {typingBot && (
              <>
                <div className="chatbox-message bot"></div>
                <div className="typing-boot">
                  Texting <span className="typing-indicator">...</span>
                </div>
              </>
            )}
            <div ref={messagesEndRef} style={{
              marginTop: 140
            }} />
          </div>
          <div className="chatbox-bottom">
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
                placeholder="Send text."
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
        </div>
      )}
    </div>
  );
};

export default ChatBox;
