import { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  getInitials,
  generateColor,
  formatDate,
  getRelativeTime,
} from "../../utils/helpers";

const Chat = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  // Mock contacts
  const [contacts] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      lastMessage: "Hey, how are you doing?",
      lastMessageTime: "2024-10-27T10:30:00",
      unreadCount: 2,
      online: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      lastMessage: "The project looks great!",
      lastMessageTime: "2024-10-27T09:15:00",
      unreadCount: 0,
      online: true,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      lastMessage: "Thanks for the update",
      lastMessageTime: "2024-10-26T18:45:00",
      unreadCount: 0,
      online: false,
    },
  ]);

  // Mock messages for selected contact
  const [messages, setMessages] = useState([
    {
      id: "1",
      senderId: "1",
      senderName: "John Doe",
      content: "Hey, how are you doing?",
      timestamp: "2024-10-27T10:25:00",
      read: true,
    },
    {
      id: "2",
      senderId: user?.id,
      senderName: user?.name,
      content: "I'm doing great! Working on the new features.",
      timestamp: "2024-10-27T10:26:00",
      read: true,
    },
    {
      id: "3",
      senderId: "1",
      senderName: "John Doe",
      content: "That sounds awesome! Let me know if you need any help.",
      timestamp: "2024-10-27T10:30:00",
      read: true,
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedContact) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user?.id,
      senderName: user?.name,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Contacts Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-white dark:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                      selectedContact?.id === contact.id ? "bg-white dark:bg-gray-800" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: generateColor(contact.name) }}
                      >
                        {getInitials(contact.name)}
                      </div>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {contact.name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {getRelativeTime(contact.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 truncate">
                          {contact.lastMessage}
                        </p>
                        {contact.unreadCount > 0 && (
                          <span className="ml-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  <p>No contacts found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{
                        backgroundColor: generateColor(selectedContact.name),
                      }}
                    >
                      {getInitials(selectedContact.name)}
                    </div>
                    {selectedContact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedContact.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {selectedContact.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors">
                    <Video className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-2 max-w-md ${
                          isOwn ? "flex-row-reverse" : ""
                        }`}
                      >
                        {!isOwn && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                            style={{
                              backgroundColor: generateColor(msg.senderName),
                            }}
                          >
                            {getInitials(msg.senderName)}
                          </div>
                        )}
                        <div>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwn
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p
                            className={`text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1 ${
                              isOwn ? "text-right" : ""
                            }`}
                          >
                            {getRelativeTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end gap-2"
                >
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors"
                  >
                    <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Type a message..."
                      rows="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!message.trim()}
                    className="gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
                  Choose a contact from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Chat;
