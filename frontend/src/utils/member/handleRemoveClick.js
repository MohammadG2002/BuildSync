/**
 * Handle remove member click
 */
const handleRemoveClick = (member, setSelectedMember, setShowRemoveModal) => {
  setSelectedMember(member);
  setShowRemoveModal(true);
};

export default handleRemoveClick;
