import { useState } from "react";

/**
 * Custom hook for managing all modal states in ProjectDetails
 */
export const useProjectModals = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowArchiveModal(false);
    setShowDetailsModal(false);
    setShowAddMemberModal(false);
    setShowTagManager(false);
  };

  return {
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    showArchiveModal,
    setShowArchiveModal,
    showDetailsModal,
    setShowDetailsModal,
    showAddMemberModal,
    setShowAddMemberModal,
    showTagManager,
    setShowTagManager,
    closeAllModals,
  };
};
