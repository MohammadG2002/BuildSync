import React, { useEffect } from "react";

export default function N8nChatWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import Chatbot from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";
      
      Chatbot.createWidget({
        webhookUrl: 'https://buildsync5.app.n8n.cloud/webhook/8b085178-cf54-4bfe-812d-0e0d562ce3ac/chat',
        initialMessages: ['Hi! I\'m BuildSync Assistance. How can I help you today?'],
        i18n: {
          en: {
            title: 'BuildSync Assistant',
            subtitle: 'Ask me anything about BuildSync',
            footer: '',
            getStarted: 'Start Chat',
            inputPlaceholder: 'Type your message...',
          }
        }
      });
    `;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
