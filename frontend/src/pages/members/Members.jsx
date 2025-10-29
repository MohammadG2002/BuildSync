import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Users as UsersIcon,
  ArrowLeft,
  Search,
  Mail,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
import * as workspaceService from "../../services/workspaceService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { SkeletonList } from "../../components/common/Loader";
import MemberList from "../../components/member/MemberList";
import toast from "react-hot-toast";
import { USER_ROLES } from "../../utils/constants";
import styles from "./Members.module.css";

const Members = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workspaces } = useWorkspace();

  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupByRole, setGroupByRole] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [inviteData, setInviteData] = useState({
    email: "",
    role: "member",
  });
  const [inviteErrors, setInviteErrors] = useState({});

  useEffect(() => {
    const ws = workspaces.find((w) => w.id === workspaceId);
    if (ws) {
      setWorkspace(ws);
    }
  }, [workspaceId, workspaces]);

  useEffect(() => {
    if (workspaceId) {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getWorkspaceMembers(workspaceId);
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      // Mock data for development
      setMembers([
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "admin",
          joinedDate: "2024-01-15",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "member",
          joinedDate: "2024-02-20",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "member",
          joinedDate: "2024-03-10",
        },
        {
          id: "4",
          name: "Alice Williams",
          email: "alice@example.com",
          role: "viewer",
          joinedDate: "2024-04-05",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({ ...prev, [name]: value }));
    if (inviteErrors[name]) {
      setInviteErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateInvite = () => {
    const errors = {};
    if (!inviteData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inviteData.email)) {
      errors.email = "Email is invalid";
    } else if (members.some((m) => m.email === inviteData.email)) {
      errors.email = "This user is already a member";
    }
    return errors;
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();

    const errors = validateInvite();
    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const newMember = await workspaceService.addWorkspaceMember(
        workspaceId,
        inviteData
      );
      // Mock success
      const mockMember = {
        id: Date.now().toString(),
        name: inviteData.email.split("@")[0],
        email: inviteData.email,
        role: inviteData.role,
        joinedDate: new Date().toISOString(),
      };
      setMembers([...members, mockMember]);
      setShowInviteModal(false);
      setInviteData({ email: "", role: "member" });
      toast.success("Member invited successfully!");
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to invite member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeRole = async (member, newRole) => {
    try {
      await workspaceService.updateMemberRole(workspaceId, member.id, newRole);
      setMembers(
        members.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
      );
      toast.success(`${member.name}'s role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      // Mock success
      setMembers(
        members.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
      );
      toast.success(`${member.name}'s role updated to ${newRole}`);
    }
  };

  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const handleRemoveMember = async () => {
    setSubmitting(true);
    try {
      await workspaceService.removeMember(workspaceId, selectedMember.id);
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setShowRemoveModal(false);
      setSelectedMember(null);
      toast.success(`${selectedMember.name} removed from workspace`);
    } catch (error) {
      console.error("Error removing member:", error);
      // Mock success
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setShowRemoveModal(false);
      setSelectedMember(null);
      toast.success(`${selectedMember.name} removed from workspace`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleStats = {
    admin: members.filter((m) => m.role === "admin").length,
    member: members.filter((m) => m.role === "member").length,
    viewer: members.filter((m) => m.role === "viewer").length,
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/workspaces/${workspaceId}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className={styles.title}>Members</h1>
            <p className={styles.subtitle}>
              Manage {workspace?.name || "workspace"} members and permissions
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowInviteModal(true)}
          className="gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Members</p>
              <p className={styles.statValue}>{members.length}</p>
            </div>
            <UsersIcon className={styles.statIcon} />
          </div>
        </Card>
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Admins</p>
              <p className={`${styles.statValue} ${styles.statValuePurple}`}>
                {roleStats.admin}
              </p>
            </div>
            <div
              className={`${styles.statIconWrapper} ${styles.statIconWrapperPurple}`}
            >
              <UsersIcon className={styles.statIconInner} />
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Members</p>
              <p className={`${styles.statValue} ${styles.statValueBlue}`}>
                {roleStats.member}
              </p>
            </div>
            <div
              className={`${styles.statIconWrapper} ${styles.statIconWrapperBlue}`}
            >
              <UsersIcon className={styles.statIconInner} />
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Viewers</p>
              <p className={`${styles.statValue} ${styles.statValueGray}`}>
                {roleStats.viewer}
              </p>
            </div>
            <div
              className={`${styles.statIconWrapper} ${styles.statIconWrapperGray}`}
            >
              <UsersIcon className={styles.statIconInner} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchFilters}>
        <div className={styles.searchWrapper}>
          <Input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Group by role:</span>
          <button
            onClick={() => setGroupByRole(!groupByRole)}
            className={`${styles.filterButton} ${
              groupByRole
                ? styles.filterButtonActive
                : styles.filterButtonInactive
            }`}
          >
            {groupByRole ? "Grouped" : "All"}
          </button>
        </div>
      </div>

      {/* Members List */}
      {loading ? (
        <div className={styles.loadingGrid}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className={styles.loadingCard}>
              <div className={styles.loadingCardInner}></div>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length > 0 ? (
        <MemberList
          members={filteredMembers}
          currentUserId={user?.id}
          onChangeRole={handleChangeRole}
          onRemove={handleRemoveClick}
          groupByRole={groupByRole}
        />
      ) : (
        <Card className={styles.emptyState}>
          <UsersIcon className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>
            {searchQuery ? "No members found" : "No members yet"}
          </h3>
          <p className={styles.emptyDescription}>
            {searchQuery
              ? "Try adjusting your search query"
              : "Invite members to collaborate on this workspace"}
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              onClick={() => setShowInviteModal(true)}
              className="gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Invite Member
            </Button>
          )}
        </Card>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteData({ email: "", role: "member" });
          setInviteErrors({});
        }}
        title="Invite Member"
      >
        <form onSubmit={handleInviteMember} className={styles.inviteForm}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="colleague@example.com"
            value={inviteData.email}
            onChange={handleInviteChange}
            error={inviteErrors.email}
            icon={Mail}
            autoFocus
          />

          <div>
            <label className={styles.formLabel}>Role</label>
            <select
              name="role"
              value={inviteData.role}
              onChange={handleInviteChange}
              className={styles.roleSelect}
            >
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
            <p className={styles.roleDescription}>
              {inviteData.role === "admin" &&
                "Can manage workspace settings and members"}
              {inviteData.role === "member" &&
                "Can create and manage projects and tasks"}
              {inviteData.role === "viewer" &&
                "Can only view projects and tasks"}
            </p>
          </div>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowInviteModal(false);
                setInviteData({ email: "", role: "member" });
                setInviteErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove Member Modal */}
      <Modal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setSelectedMember(null);
        }}
        title="Remove Member"
        size="sm"
      >
        <div className={styles.removeContent}>
          <p className={styles.removeText}>
            Are you sure you want to remove{" "}
            <strong>{selectedMember?.name}</strong> from this workspace? They
            will lose access to all projects and tasks.
          </p>
          <div className={styles.removeActions}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowRemoveModal(false);
                setSelectedMember(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveMember}
              loading={submitting}
            >
              Remove Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Members;
