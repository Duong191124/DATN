import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { CloseOutlined, MessageOutlined } from "@ant-design/icons";
import { ChatService } from "../../../../service/chat.service/chat.service";
import { message } from "antd";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { content: "Hello! Can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typingUser, setTypingUser] = useState(false);
  const [typingBot, setTypingBot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Lấy dữ liệu chat từ local storage khi khởi tạo component
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Lưu dữ liệu chat vào local storage mỗi khi messages thay đổi
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("scroll: ");
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
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbox-message ${msg.sender}`}>
                {msg.content}
              </div>
            ))}
            {typingBot && (
              <div className="chatbox-message bot">
                <div className="typing-boot">
                  Texting <span className="typing-indicator">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} style={{ marginTop: 140 }} />
          </div>
          <div className="chatbox-bottom">
            <div className="chatbox-suggestions">
              <button onClick={() => sendMessage("How long does it take shipping?")}>shipping</button>
              <button onClick={() => sendMessage("Can I change my order after it has been placed")}>Order</button>
              <button onClick={() => sendMessage("What are your customer service hours?")}>Service</button>
              <button onClick={() => sendMessage("Hey! Need any help?")}>Support</button>
            </div>
            <div className="chatbox-input">
              <input
                disabled={typingBot || isLoading}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setTypingUser(true);
                }}
                placeholder="Send text."
                onBlur={() => setTypingUser(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !typingBot && input.trim() !== "") {
                    setIsLoading(true);
                    sendMessage(input).finally(() => {
                      setIsLoading(false);
                    });
                  }
                }}
              />
              <button
                disabled={typingBot || isLoading || input.trim() === ""}
                onClick={() => {
                  if (!typingBot && input.trim() !== "") {
                    setIsLoading(true);
                    sendMessage(input).finally(() => {
                      setIsLoading(false);
                    });
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
