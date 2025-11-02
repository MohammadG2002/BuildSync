import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { getWorkspaceById } from "../../services/workspaceService";
import {
  acceptWorkspaceInvite,
  declineWorkspaceInvite,
} from "../../services/workspaceService";

const InviteRequestModal = ({ notification, isOpen, onClose, onHandled }) => {
  const [loading, setLoading] = useState(false);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const fetchWs = async () => {
      if (notification?.metadata?.workspaceId) {
        try {
          const ws = await getWorkspaceById(notification.metadata.workspaceId);
          setWorkspace(ws);
        } catch {
          setWorkspace(null);
        }
      }
    };
    if (isOpen) fetchWs();
  }, [isOpen, notification]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptWorkspaceInvite(
        notification.metadata.workspaceId,
        notification.id || notification._id
      );
      onHandled?.("accepted");
      onClose();
    } catch (e) {
      // noop - could show toast
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await declineWorkspaceInvite(
        notification.metadata.workspaceId,
        notification.id || notification._id
      );
      onHandled?.("declined");
      onClose();
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workspace Invitation">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <h3 style={{ fontWeight: 600 }}>{workspace?.name || "Workspace"}</h3>
          {workspace?.description && (
            <p style={{ color: "#4b5563", marginTop: "0.25rem" }}>
              {workspace.description}
            </p>
          )}
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

export default InviteRequestModal;
