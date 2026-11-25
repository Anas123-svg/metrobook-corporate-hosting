import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Mail, Pencil, Shield, Trash2, User, UserPlus } from "lucide-react";
import type { CreateTeamAccountRequest, TeamAccount, UpdateTeamAccountRequest } from "../../models/hostAuth";
import {
  createHostTeamAccount,
  deleteTeamAccountById,
  fetchTeamAccountById,
  fetchCurrentHostProfile,
  fetchHostTeamAccounts,
  updateTeamAccountById,
} from "../../services/hostApi";
import { getHostDetails } from "../../services/hostAuthStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

type TeamMemberFormState = {
  name: string;
  email: string;
  job_title: string;
  role: string;
  password: string;
  phone_number: string;
  profile_pic: string;
  is_active: boolean;
};

const initialFormState: TeamMemberFormState = {
  name: "",
  email: "",
  job_title: "",
  role: "",
  password: "",
  phone_number: "",
  profile_pic: "",
  is_active: true,
};

const memberRoleOptions = [
  { label: "Trip Manager", value: "trip_manager" },
  { label: "Staff", value: "staff" },
];

const formatRole = (role: string) => {
  if (!role) {
    return "Unknown";
  }

  return role
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const getRoleBucket = (role: string) => {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "super_admin" || normalizedRole.includes("admin")) {
    return "admin";
  }

  if (normalizedRole.includes("client")) {
    return "client";
  }

  return "user";
};

const getRoleBadgeClassName = (role: string) => {
  const bucket = getRoleBucket(role);

  if (bucket === "admin") {
    return "bg-[#00CFC5]/20 text-[#00CFC5] border border-[#00CFC5]/30";
  }

  if (bucket === "user") {
    return "bg-[#0E5E4F]/20 text-[#0E5E4F] border border-[#0E5E4F]/30";
  }

  return "bg-black/10 text-[#666666] border border-black/10";
};

export function PeoplePage() {
  const [members, setMembers] = useState<TeamAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberForm, setMemberForm] = useState<TeamMemberFormState>(initialFormState);
  const [isSavingMember, setIsSavingMember] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isLoadingMemberDetails, setIsLoadingMemberDetails] = useState(false);
  const [pendingDeleteMemberId, setPendingDeleteMemberId] = useState<string | null>(null);

  const resolveHostId = useCallback(async () => {
    if (hostId) {
      return hostId;
    }

    const hostFromStorage = getHostDetails()?.id;
    if (hostFromStorage) {
      setHostId(hostFromStorage);
      return hostFromStorage;
    }

    const hostProfile = await fetchCurrentHostProfile();
    if (!hostProfile.id) {
      throw new Error("Host ID is missing. Please sign in again.");
    }

    setHostId(hostProfile.id);
    return hostProfile.id;
  }, [hostId]);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const resolvedHostId = await resolveHostId();
      const teamMembers = await fetchHostTeamAccounts(resolvedHostId);
      setMembers(teamMembers);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Unable to load team members right now.");
    } finally {
      setIsLoading(false);
    }
  }, [resolveHostId]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const activeRoleCounts = useMemo(() => {
    return members.reduce(
      (counts, member) => {
        if (!member.is_active) {
          return counts;
        }

        const bucket = getRoleBucket(member.role);
        if (bucket === "admin") {
          counts.admin += 1;
        } else if (bucket === "client") {
          counts.client += 1;
        } else {
          counts.user += 1;
        }

        return counts;
      },
      { admin: 0, user: 0, client: 0 },
    );
  }, [members]);

  const closeModal = () => {
    setIsAddMemberOpen(false);
    setModalError(null);
    setMemberForm(initialFormState);
    setEditingMemberId(null);
    setIsLoadingMemberDetails(false);
  };

  const openAddMemberModal = () => {
    setEditingMemberId(null);
    setModalError(null);
    setMemberForm(initialFormState);
    setIsAddMemberOpen(true);
  };

  const openEditMemberModal = async (memberId: string) => {
    setIsLoadingMemberDetails(true);
    setModalError(null);
    setIsAddMemberOpen(true);
    setEditingMemberId(memberId);

    try {
      const memberDetails = await fetchTeamAccountById(memberId);

      if (!memberDetails) {
        throw new Error("Unable to load team member details.");
      }

      setMemberForm({
        name: memberDetails.name ?? "",
        email: memberDetails.email ?? "",
        job_title: memberDetails.job_title ?? "",
        role: memberDetails.role ?? "",
        password: "",
        phone_number: memberDetails.phone_number ?? "",
        profile_pic: memberDetails.profile_pic ?? "",
        is_active: memberDetails.is_active,
      });
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Unable to load member details right now.");
    } finally {
      setIsLoadingMemberDetails(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    const shouldDelete = window.confirm("Delete this team member?");
    if (!shouldDelete) {
      return;
    }

    setPendingDeleteMemberId(memberId);
    setFetchError(null);

    try {
      await deleteTeamAccountById(memberId);
      await loadMembers();
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Unable to delete team member right now.");
    } finally {
      setPendingDeleteMemberId(null);
    }
  };

  const handleAddMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalError(null);

    if (!editingMemberId) {
      const requiredValues = [
        { key: "name", value: memberForm.name },
        { key: "email", value: memberForm.email },
        { key: "job title", value: memberForm.job_title },
        { key: "role", value: memberForm.role },
        { key: "password", value: memberForm.password },
      ];

      const missingField = requiredValues.find((field) => !field.value.trim());
      if (missingField) {
        setModalError(`Please provide ${missingField.key}.`);
        return;
      }
    }

    setIsSavingMember(true);

    try {
      const resolvedHostId = await resolveHostId();
      const basePayload = {
        name: memberForm.name.trim(),
        email: memberForm.email.trim(),
        job_title: memberForm.job_title.trim(),
        role: memberForm.role.trim(),
        is_active: memberForm.is_active,
      };

      if (editingMemberId) {
        const updatePayload: UpdateTeamAccountRequest = {
          is_active: memberForm.is_active,
        };

        if (basePayload.name) {
          updatePayload.name = basePayload.name;
        }

        if (basePayload.email) {
          updatePayload.email = basePayload.email;
        }

        if (basePayload.job_title) {
          updatePayload.job_title = basePayload.job_title;
        }

        if (basePayload.role) {
          updatePayload.role = basePayload.role;
        }

        if (memberForm.password.trim()) {
          updatePayload.password = memberForm.password;
        }

        if (memberForm.phone_number.trim()) {
          updatePayload.phone_number = memberForm.phone_number.trim();
        }

        if (memberForm.profile_pic.trim()) {
          updatePayload.profile_pic = memberForm.profile_pic.trim();
        }

        await updateTeamAccountById(editingMemberId, updatePayload);
      } else {
        const createPayload: CreateTeamAccountRequest = {
          ...basePayload,
          password: memberForm.password,
        };

        if (memberForm.phone_number.trim()) {
          createPayload.phone_number = memberForm.phone_number.trim();
        }

        if (memberForm.profile_pic.trim()) {
          createPayload.profile_pic = memberForm.profile_pic.trim();
        }

        await createHostTeamAccount(resolvedHostId, createPayload);
      }
      closeModal();
      await loadMembers();
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Unable to save member right now.");
    } finally {
      setIsSavingMember(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">People</h1>
          <p className="text-[#666666]">Manage team members and access control</p>
        </div>
        <button
          type="button"
          onClick={openAddMemberModal}
          className="px-6 py-3 bg-[#00CFC5] text-white rounded-xl hover:bg-[#00CFC5]/90 transition-all flex items-center gap-2 shadow-sm font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <Shield className="w-10 h-10 text-[#00CFC5] mb-4" />
          <h3 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Corporate Admin</h3>
          <p className="text-[#666666] text-sm mb-4">Full access to all features and settings</p>
          <div className="bg-white rounded-xl p-3 border border-[#00CFC5]/20">
            <p className="text-[#666666] text-xs">Active Members</p>
            <p className="text-2xl text-[#00CFC5] font-['Playfair_Display'] mt-1">
              {activeRoleCounts.admin}
            </p>
          </div>
        </div>

        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <User className="w-10 h-10 text-[#0E5E4F] mb-4" />
          <h3 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Corporate User</h3>
          <p className="text-[#666666] text-sm mb-4">Can create and manage bookings</p>
          <div className="bg-white rounded-xl p-3 border border-[#0E5E4F]/20">
            <p className="text-[#666666] text-xs">Active Members</p>
            <p className="text-2xl text-[#0E5E4F] font-['Playfair_Display'] mt-1">
              {activeRoleCounts.user}
            </p>
          </div>
        </div>

        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <Mail className="w-10 h-10 text-[#999999] mb-4" />
          <h3 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Client</h3>
          <p className="text-[#666666] text-sm mb-4">View only access to their bookings</p>
          <div className="bg-white rounded-xl p-3 border border-black/10">
            <p className="text-[#666666] text-xs">Active Members</p>
            <p className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mt-1">
              {activeRoleCounts.client}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F8F8] rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Team Members</h2>
          <button
            type="button"
            onClick={() => void loadMembers()}
            className="px-3 py-2 rounded-lg border border-black/10 text-sm text-[#0D0D0D] hover:bg-black/5"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 flex items-center gap-2 text-[#666666]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading team members...
          </div>
        ) : fetchError ? (
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Could not load team members</p>
                <p className="text-sm mt-1">{fetchError}</p>
              </div>
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-[#666666]">No team members yet. Use Add Member to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Name</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Email</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Job Title</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Role</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Status</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-black/5 hover:bg-white transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#00CFC5]/20 flex items-center justify-center border border-[#00CFC5]/30">
                          <User className="w-5 h-5 text-[#00CFC5]" />
                        </div>
                        <span className="text-[#0D0D0D] font-medium">{member.name || "-"}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[#666666]">{member.email || "-"}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-[#666666]">{member.job_title || "-"}</span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getRoleBadgeClassName(member.role)}`}
                      >
                        {formatRole(member.role)}
                      </span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          member.is_active
                            ? "bg-[#0E5E4F]/20 text-[#0E5E4F] border border-[#0E5E4F]/30"
                            : "bg-black/10 text-[#666666] border border-black/10"
                        }`}
                      >
                        {member.is_active ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void openEditMemberModal(member.id)}
                          className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#00CFC5]"
                          title="Edit member"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={pendingDeleteMemberId === member.id}
                          onClick={() => void handleDeleteMember(member.id)}
                          className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#B3261E] disabled:opacity-60"
                          title="Delete member"
                        >
                          {pendingDeleteMemberId === member.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0D0D0D] font-['Playfair_Display']">
              {editingMemberId ? "Edit Member" : "Add Member"}
            </DialogTitle>
            <DialogDescription>
              {editingMemberId
                ? "All fields are optional while editing."
                : "Required fields: name, email, job title, role, and password."}
            </DialogDescription>
          </DialogHeader>

          {isLoadingMemberDetails ? (
            <div className="py-6 flex items-center gap-2 text-[#666666]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading member details...
            </div>
          ) : (
          <form className="space-y-4" onSubmit={(event) => void handleAddMember(event)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  Name{editingMemberId ? "" : " *"}
                </label>
                <input
                  type="text"
                  required={!editingMemberId}
                  value={memberForm.name}
                  onChange={(event) =>
                    setMemberForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  Email{editingMemberId ? "" : " *"}
                </label>
                <input
                  type="email"
                  required={!editingMemberId}
                  value={memberForm.email}
                  onChange={(event) =>
                    setMemberForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  Job Title{editingMemberId ? "" : " *"}
                </label>
                <input
                  type="text"
                  required={!editingMemberId}
                  value={memberForm.job_title}
                  onChange={(event) =>
                    setMemberForm((current) => ({ ...current, job_title: event.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  Role{editingMemberId ? "" : " *"}
                </label>
                <select
                  required={!editingMemberId}
                  value={memberForm.role}
                  onChange={(event) =>
                    setMemberForm((current) => ({ ...current, role: event.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                >
                  <option value="">
                    Select role
                  </option>
                  {memberRoleOptions.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  Password{editingMemberId ? "" : " *"}
                </label>
                <input
                  type="password"
                  required={!editingMemberId}
                  value={memberForm.password}
                  onChange={(event) =>
                    setMemberForm((current) => ({ ...current, password: event.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666666] mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={memberForm.phone_number}
                  onChange={(event) =>
                    setMemberForm((current) => ({ ...current, phone_number: event.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#666666] mb-2">Profile Picture URL</label>
              <input
                type="url"
                value={memberForm.profile_pic}
                onChange={(event) =>
                  setMemberForm((current) => ({ ...current, profile_pic: event.target.value }))
                }
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-[#0D0D0D]">
              <input
                type="checkbox"
                checked={memberForm.is_active}
                onChange={(event) =>
                  setMemberForm((current) => ({ ...current, is_active: event.target.checked }))
                }
                className="h-4 w-4 rounded border-black/20 accent-[#00CFC5]"
              />
              Member is active
            </label>

            {modalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {modalError}
              </div>
            )}

            <DialogFooter>
              <button
                type="button"
                disabled={isSavingMember}
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-black/10 text-[#0D0D0D] hover:bg-black/5 transition-all disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingMember}
                className="px-4 py-2 rounded-xl bg-[#00CFC5] text-white hover:bg-[#00CFC5]/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSavingMember && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingMemberId ? "Update Member" : "Save Member"}
              </button>
            </DialogFooter>
          </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}