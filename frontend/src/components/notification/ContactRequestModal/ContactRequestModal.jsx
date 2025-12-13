import { useState } from "react";
import Modal from "../../common/modal/Modal/Modal";
import Button from "../../common/button/Button/Button";
import { acceptContact, removeContact } from "../../../services/contactService";
import { toast } from "react-hot-toast";

const ContactRequestModal = ({ notification, isOpen, onClose, onHandled }) => {
  const [loading, setLoading] = useState(false);

  const senderName =
    notification?.sender?.name || notification?.senderName || "Someone";
  const senderId =
    notification?.sender?._id ||
    notification?.sender?.id ||
    notification?.senderId;

  const handleAccept = async () => {
    if (!senderId) {
      toast.error("Invalid contact request");
      onClose();
      return;
    }

    setLoading(true);
    try {
      await acceptContact(senderId);
      toast.success("Contact request accepted");
      onHandled?.("accepted");
      onClose();
    } catch (e) {
      toast.error(e?.message || "Failed to accept contact request");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!senderId) {
      toast.error("Invalid contact request");
      onClose();
      return;
    }

    setLoading(true);
    try {
      await removeContact(senderId);
      toast.success("Contact request declined");
      onHandled?.("declined");
      onClose();
    } catch (e) {
      toast.error(e?.message || "Failed to decline contact request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Request">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            <strong>{senderName}</strong> wants to add you as a contact.
          </p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            You'll be able to send direct messages to each other.
          </p>
        </div>
        <div
          style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
        >
          <Button
            variant="secondary"
            onClick={handleDecline}
            disabled={loading}
          >
            Decline
          </Button>
          <Button variant="primary" onClick={handleAccept} loading={loading}>
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactRequestModal;
