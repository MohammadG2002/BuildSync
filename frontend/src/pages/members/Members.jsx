import { useEffect, useState, useMemo } from "react";
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
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { SkeletonList } from "../../components/common/Loader";
import MemberList from "../../components/member/MemberList";
import { USER_ROLES } from "../../utils/constants";
import fetchMembers from "../../utils/member/fetchMembers";
import handleInviteChange from "../../utils/member/handleInviteChange";
import handleInviteMember from "../../utils/member/handleInviteMember";
import handleChangeRole from "../../utils/member/handleChangeRole";
import handleRemoveClick from "../../utils/member/handleRemoveClick";
import handleRemoveMember from "../../utils/member/handleRemoveMember";
import filterMembers from "../../utils/member/filterMembers";
import calculateRoleStats from "../../utils/member/calculateRoleStats";
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
      fetchMembers(workspaceId, setMembers, setLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const filteredMembers = filterMembers(members, searchQuery);
  const roleStats = calculateRoleStats(members);
  const currentUserId = user?._id || user?.id;
  const currentMember = useMemo(
    () => members.find((m) => m.id === currentUserId),
    [members, currentUserId]
  );
  const canInvite =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/workspaces/${workspaceId}`)}
            className={styles.headerBackButton}
          >
            <ArrowLeft className={styles.headerBackIcon} />
          </Button>
          <div>
            <h1 className={styles.title}>Members</h1>
            <p className={styles.subtitle}>
              Manage {workspace?.name || "workspace"} members and permissions
            </p>
          </div>
        </div>
        {canInvite && (
          <Button
            variant="primary"
            onClick={() => setShowInviteModal(true)}
            className={styles.headerInviteButton}
          >
            <UserPlus className={styles.headerInviteIcon} />
            Invite Member
          </Button>
        )}
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
          currentUserId={user?._id || user?.id}
          currentUserRole={currentMember?.role}
          onChangeRole={(member, newRole) =>
            handleChangeRole(member, newRole, workspaceId, members, setMembers)
          }
          onRemove={(member) =>
            handleRemoveClick(member, setSelectedMember, setShowRemoveModal)
          }
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
          {!searchQuery && canInvite && (
            <Button
              variant="primary"
              onClick={() => setShowInviteModal(true)}
              className={styles.emptyInviteButton}
            >
              <UserPlus className={styles.emptyInviteIcon} />
              Invite Member
            </Button>
          )}
        </Card>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={canInvite && showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteData({ email: "", role: "member" });
          setInviteErrors({});
        }}
        title="Invite Member"
      >
        <form
          onSubmit={(e) =>
            handleInviteMember(
              e,
              workspaceId,
              inviteData,
              members,
              setMembers,
              setShowInviteModal,
              setInviteData,
              setInviteErrors,
              setSubmitting
            )
          }
          className={styles.inviteForm}
        >
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="colleague@example.com"
            value={inviteData.email}
            onChange={(e) =>
              handleInviteChange(
                e,
                setInviteData,
                inviteErrors,
                setInviteErrors
              )
            }
            error={inviteErrors.email}
            icon={Mail}
            autoFocus
          />

          <div>
            <label className={styles.formLabel}>Role</label>
            <select
              name="role"
              value={inviteData.role}
              onChange={(e) =>
                handleInviteChange(
                  e,
                  setInviteData,
                  inviteErrors,
                  setInviteErrors
                )
              }
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
              onClick={() =>
                handleRemoveMember(
                  workspaceId,
                  selectedMember,
                  members,
                  setMembers,
                  setShowRemoveModal,
                  setSelectedMember,
                  setSubmitting
                )
              }
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
