import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Smile, X } from "lucide-react";
import Button from "../common/Button";
import styles from "../../pages/chat/Chat.module.css";
import "emoji-picker-element";

const MessageInput = ({ message, onMessageChange, onSendMessage }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [files, setFiles] = useState([]);
  const textareaRef = useRef(null);
  const pickerRef = useRef(null);
  const triggerWrapperRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage({ attachments: files });
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage({ attachments: files });
      setFiles([]);
    }
  };

  // Insert text at current caret position in the textarea
  const insertAtCursor = (text) => {
    const el = textareaRef.current;
    if (!el) {
      onMessageChange((message || "") + text);
      return;
    }
    const start = el.selectionStart ?? message.length;
    const end = el.selectionEnd ?? message.length;
    const newValue =
      (message || "").slice(0, start) + text + (message || "").slice(end);
    onMessageChange(newValue);
    // restore caret after inserted emoji
    requestAnimationFrame(() => {
      try {
        el.focus();
        const caret = start + text.length;
        el.setSelectionRange(caret, caret);
      } catch {}
    });
  };

  // Wire up emoji-click event from the web component
  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;
    const handler = (event) => {
      const emoji =
        event.detail?.unicode ||
        event.detail?.emoji?.unicode ||
        event.detail?.emoji;
      if (emoji) {
        insertAtCursor(emoji);
      }
    };
    picker.addEventListener("emoji-click", handler);
    return () => picker.removeEventListener("emoji-click", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerRef.current, message]);

  // Close emoji popover when clicking outside or pressing Escape
  useEffect(() => {
    if (!showEmoji) return;

    const handleClickOutside = (e) => {
      const wrapper = triggerWrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowEmoji(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showEmoji]);

  return (
    <div className={styles.inputArea}>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            if (selected.length) {
              setFiles((prev) => [...prev, ...selected]);
            }
            // reset so same file re-select can trigger change
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Attach file"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className={styles.iconButtonIcon} />
        </button>
        <div className={styles.emojiTriggerWrapper} ref={triggerWrapperRef}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Insert emoji"
            onClick={(e) => {
              e.stopPropagation();
              setShowEmoji((v) => !v);
            }}
            ref={toggleBtnRef}
          >
            {showEmoji ? (
              <X className={styles.iconButtonIcon} />
            ) : (
              <Smile className={styles.iconButtonIcon} />
            )}
          </button>
          {showEmoji && (
            <div className={styles.emojiPopover}>
              {/* Custom element: https://github.com/nolanlawson/emoji-picker-element */}
              <emoji-picker ref={pickerRef}></emoji-picker>
            </div>
          )}
        </div>
        <div className={styles.inputWrapper}>
          {files.length > 0 && (
            <div className={styles.attachmentsBar}>
              {files.map((f, idx) => {
                const isImg = (f.type || "").startsWith("image/");
                const url = isImg ? URL.createObjectURL(f) : null;
                return (
                  <div
                    key={idx}
                    className={styles.attachmentPill}
                    title={f.name}
                  >
                    {isImg ? (
                      <img
                        src={url}
                        alt={f.name}
                        className={styles.attachmentThumb}
                      />
                    ) : (
                      <span className={styles.messageAttachmentIcon}>📎</span>
                    )}
                    <span className={styles.attachmentName}>{f.name}</span>
                    <button
                      type="button"
                      className={styles.attachmentRemove}
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      aria-label="Remove attachment"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows="1"
            className={styles.input}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() && files.length === 0}
          className={styles.sendButton}
        >
          <Send className={styles.submitButtonIcon} />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
