import React from "react";
import Card from "../../components/common/Card";
import ChatPanel from "../../components/ai/ChatPanel";
import styles from "./Chat.module.css";

const AIChat = () => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div style={{ height: "100%", width: "100%" }}>
          <ChatPanel />
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
