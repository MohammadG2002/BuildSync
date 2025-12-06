import React from "react";
import { Paperclip } from "lucide-react";
import styles from "../../TaskDetailsModal.module.css";
import { buildAbsoluteUrl } from "../../../../../utils/helpers/buildAbsoluteUrl";
import formatFileSize from "../../../../../utils/helpers/formatFileSize";

const CommentAttachmentItem = ({ attachment }) => {
  const name = attachment?.originalName || attachment?.filename || "Attachment";
  const href = attachment?.url ? buildAbsoluteUrl(attachment.url) : undefined;
  const filenameOrUrl =
    attachment?.originalName || attachment?.filename || attachment?.url || "";
  const isImage =
    !!href &&
    (attachment?.mimetype?.startsWith?.("image/") ||
      /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(filenameOrUrl));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.attachmentContent}
      title={name}
    >
      {isImage ? (
        <img
          src={href}
          alt={name}
          style={{
            maxWidth: "100px",
            maxHeight: "100px",
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      ) : (
        <Paperclip className={styles.attachmentIcon} />
      )}
      <div className={styles.attachmentInfo}>
        <p className={styles.attachmentMeta}>
          {attachment?.size && formatFileSize(attachment.size)}
        </p>
      </div>
    </a>
  );
};

export default CommentAttachmentItem;
