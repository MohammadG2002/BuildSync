import React from "react";
import Card from "../../components/common/Card";
import ChatPanel from "../../components/ai/ChatPanel";
import styles from "./Chat.module.css";

const AIChat = () => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div style={{ height: "64vh" }}>
          <ChatPanel />
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
