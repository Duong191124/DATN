import React, { useEffect, useRef, useState } from "react";
import { MessageFilled, CloseOutlined, SendOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import { ChatService } from "../../../../service/chat.service/chat.service";
import { useTranslation } from "react-i18next";
const ChatContainer = styled(motion.div)`
  display: flex;
  justify-content: end;
  width: 600px;
  height: 140px;
  position: fixed;
  bottom: 20px;
  right: 24px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
`;

const ChatButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #000;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ChatWindow = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 60px;
  width: 380px;
  height: 600px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  background: #000;
  color: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const HeaderTitle = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;

const Message = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;

  ${(props) =>
    props.$isBot
      ? `
    align-self: flex-start;
    background: #f0f0f0;
    color: #000;
  `
      : `
    align-self: flex-end;
    background: #000;
    color: #fff;
  `}
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &:disabled {
    background: #f5f5f5;
  }
`;

const SendButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
`;

const QuickReplies = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const QuickReply = styled.button`
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #000;
  }
`;

const TypingIndicator = styled.div`
  padding: 8px 16px;
  background: #f0f0f0;
  border-radius: 12px;
  align-self: flex-start;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    display: inline-block;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-3px);
    }
    60% {
      transform: translateY(-2px);
    }
  }
`;

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { content: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typingBot, setTypingBot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      const defaultLang = i18n.language || "vi";
      i18n.changeLanguage(defaultLang);
    }
  }, [i18n.language]);
  const messagesEndRef = useRef(null);
  const chatboxRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const sendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    const newMessage = { content: messageContent, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTypingBot(true);

    try {
      const res = await ChatService(messageContent);
      const botResponse = { content: res.data, sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setTypingBot(false);
      setIsLoading(false);
    }
  };

  const debouncedSend = debounce(sendMessage, 300);

  const quickReplies = [
    { text: `${t("MES-101")}`, query: "How long does shipping take?" },
    { text: `${t("MES-102")}`, query: "Can I modify my order?" },
    { text: `${t("MES-103")}`, query: "What are your service hours?" },
    { text: `${t("MES-104")}`, query: "I need help with my purchase" },
    { text: `${t("MES-105")}`, query: "What payment methods do you accept?" },
    { text: `${t("MES-106")}`, query: "Do you ship internationally?" },
    { text: `${t("MES-107")}`, query: "How long will delivery take?" },
    { text: `${t("MES-108")}`, query: "Where can I find the size guide?" },
  ];

  return (
    <ChatContainer ref={chatboxRef}>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Header>
              <Logo src="/image/logo.jpg" alt="Logo" />
              <HeaderTitle>{t("MES-099")}</HeaderTitle>
              <CloseButton onClick={() => setIsOpen(false)}>
                <CloseOutlined style={{ fontSize: 16 }} />
              </CloseButton>
            </Header>

            <MessagesContainer>
              {messages.map((msg, index) => (
                <Message key={index} $isBot={msg.sender === "bot"}>
                  {msg.content}
                </Message>
              ))}
              {typingBot && (
                <TypingIndicator>
                  Typing
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </TypingIndicator>
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputContainer>
              <QuickReplies>
                {quickReplies.map((reply, index) => (
                  <QuickReply
                    key={index}
                    onClick={() => !isLoading && sendMessage(reply.query)}
                  >
                    {reply.text}
                  </QuickReply>
                ))}
              </QuickReplies>

              <InputWrapper>
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("MES-100")}
                  disabled={typingBot || isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !typingBot && !isLoading) {
                      setIsLoading(true);
                      debouncedSend(input);
                    }
                  }}
                />
                <SendButton
                  disabled={!input.trim() || typingBot || isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    debouncedSend(input);
                  }}
                >
                  <SendOutlined />
                </SendButton>
              </InputWrapper>
            </InputContainer>
          </ChatWindow>
        )}
      </AnimatePresence>
      <ChatButton onClick={() => setIsOpen(!isOpen)} whileTap={{ scale: 0.95 }}>
        <MessageFilled style={{ fontSize: 24, color: "#fff" }} />
      </ChatButton>
    </ChatContainer>
  );
}
