import { useState } from "react";
import * as contactService from "../../services/contactService";
import toast from "react-hot-toast";
import fetchContacts from "../../utils/chat/fetchContacts";

export function useInviteModal(setContacts, setLoading) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openModal = () => {
    setShowAddModal(true);
    setInviteEmail("");
  };
  const closeModal = () => {
    setShowAddModal(false);
    setInviteEmail("");
  };

  const sendInvite = async () => {
    try {
      setSubmitting(true);
      const contact = await contactService.requestContactByEmail(
        inviteEmail.trim()
      );
      toast.success(contact ? "Contact request sent" : "Invite processed");
      setShowAddModal(false);
      setInviteEmail("");
      fetchContacts(null, setContacts, setLoading);
    } catch (e) {
      console.error("Invite failed", e);
      toast.error("Failed to send contact invite");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showAddModal,
    setShowAddModal,
    inviteEmail,
    setInviteEmail,
    submitting,
    openModal,
    closeModal,
    sendInvite,
  };
}
