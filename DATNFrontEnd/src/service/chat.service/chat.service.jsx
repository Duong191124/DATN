import axios from "axios";

const ChatService = (message) => {
  const URL_BACKEND = "http://127.0.0.1:8080/api/v1/chatbox/chat";
  const data = {
    message: message,
  };
  return axios.post(URL_BACKEND, data);
};
export { ChatService };
