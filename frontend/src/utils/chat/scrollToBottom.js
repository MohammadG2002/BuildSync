/**
 * Scroll to bottom of messages
 */
const scrollToBottom = (messagesEndRef) => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

export default scrollToBottom;
