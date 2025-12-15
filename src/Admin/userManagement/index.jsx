// import React from "react";

// export default UserManagement;

import { Modal } from "@/components/custome/Modal";
import { useEffect, useState, useMemo } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiLink,
  FiTrash2,
  FiCheck,
  FiMessageSquare,
  FiCircle,
  FiList,
  FiCode,
} from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { BiShield, BiShieldX } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from "use-debounce";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/Redux/services/usersApi";

export default function UserManagement() {
  const { data: usersData, isLoading, error } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [fromType, setFromType] = useState("add");
  const [editingUser, setEditingUser] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);

  // Debounce search term to avoid too many API calls
  const [debouncedSearchTerm] = useDebounce(searchTerm.trim(), 1);

  const users = usersData || [];

  // Filter users based on search term, type filter, and status filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        user.full_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || user.role === typeFilter; // Assuming role field exists, adjust if not

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && user.is_active) ||
        (statusFilter === "draft" && !user.is_active);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, debouncedSearchTerm, typeFilter, statusFilter]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  useEffect(() => {
    setFromType("add");
  }, []);
  useEffect(() => {
    !open && setEditingUser(null);
  }, [open]);

  return (
    <div>
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <button
            onClick={() => {
              setFromType("add");
              setOpen(true);
            }}
            className="bg-[#c4ff0d] text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-[#b0e600] transition-colors flex items-center gap-2"
          >
            <FiPlus className="text-xl" />
            Add New User
          </button>
        </div>
      </div>

      <div
        className="bg-[#1a0e1e] p-6 rounded-xl border border-gray-700/50 mb-6
            "
      >
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-6  border border-gray-700/50 rounded-lg p-4">
            <div className="flex-1 relative ">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none outline-none pl-10 pr-4 py-2 text-white placeholder-gray-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white outline-none cursor-pointer"
            >
              <option className="text-black" value="all">
                All Roll
              </option>
              <option className="text-black" value="User">
                User
              </option>
              <option className="text-black" value="Admin">
                Admin
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border border-gray-600 rounded-lg px-4 py-2  text-white outline-none cursor-pointer"
            >
              <option className="text-black" value="all">
                All Status
              </option>
              <option className="text-black" value="published">
                Active
              </option>
              <option className="text-black" value="draft">
                Inactive
              </option>
            </select>
          </div>

          {/* Table */}
          <div className=" border border-gray-700/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[linear-gradient(90deg,#C0FF4C66,#99235C66)] text-white">
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-left px-6 py-4 font-medium">Status</th>
                  <th className="text-left px-6 py-4 font-medium">
                    Last Login
                  </th>
                  <th className="text-left px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(0, displayCount).map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-700/30 hover:bg-[#2d2440] transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {item.full_name}
                    </td>
                    <td className="px-6 py-4  text-white">{item.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span
                          className={`${
                            item?.is_active
                              ? "bg-green-400/20 text-primary"
                              : "bg-red-600/20 text-red-500"
                          }  text-xs px-3 py-1 rounded-full`}
                        >
                          {item?.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{formatDateTime(item?.date_joined)}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item?.is_active ? (
                          <button className="p-2 bg-primary/20 rounded-lg transition-colors group">
                            <BiShield className="text-green-400 " />
                          </button>
                        ) : (
                          <button className="p-2 bg-red-500/20 rounded-lg transition-colors group">
                            <BiShieldX className="text-red-400 " />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setEditingUser(item);
                            setFromType("edit");
                            setOpen(true);
                          }}
                          className="p-2 bg-pink-500/20 rounded-lg transition-colors group"
                        >
                          <FaRegEdit className="text-pink-400" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-500/20 rounded-lg transition-colors group"
                        >
                          <FiTrash2 className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Load More Button */}
          {filteredUsers.length > displayCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setDisplayCount(displayCount + 10)}
                className="bg-[#c4ff0d] text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-[#b0e600] transition-colors"
              >
                Load More
              </button>
            </div>
          )}
      </div>
      {/* <button onClick={() => setOpen(true)}>Open Modal</button> */}
      <Modal open={open} className="max-w-2xl  p-4 " onOpenChange={setOpen}>
        {/* <ContentForm />
         */}
        <EditUser
          fromType={fromType}
          editingUser={editingUser}
          createUser={createUser}
          updateUser={updateUser}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </div>
  );
}

function EditUser({ fromType, editingUser, createUser, updateUser, onCancel }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const [email, setEmail] = useState(editingUser ? editingUser.email : "");
  const [fullName, setFullName] = useState(editingUser ? editingUser.full_name : "");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(editingUser ? formatDate(editingUser.date_of_birth) : "");
  const [isActive, setIsActive] = useState(editingUser ? editingUser.is_active : true);
  const [error, setError] = useState("");

  const handleAddUser = async () => {
    if (!email.trim() || !fullName.trim() || !password.trim() || !dateOfBirth.trim()) return;
    setError("");
    try {
      await createUser({ email, full_name: fullName, password, date_of_birth: dateOfBirth, is_active: isActive }).unwrap();
      toast.success("User created successfully!");
      setEmail("");
      setFullName("");
      setPassword("");
      setDateOfBirth("");
      setIsActive(true);
      onCancel();
    } catch (err) {
      console.error("Failed to create user:", err);
      if (err.data && err.data.email) {
        setError(err.data.email[0]);
      } else {
        setError("Failed to create user. Please try again.");
      }
      toast.error("Failed to create user. Please try again.");
    }
  };

  const handleUpdateUser = async () => {
    if (!email.trim() || !fullName.trim() || !dateOfBirth.trim()) return;
    setError("");
    try {
      await updateUser({ id: editingUser.id, email, full_name: fullName, date_of_birth: dateOfBirth, is_active: isActive }).unwrap();
      toast.success("User updated successfully!");
      onCancel();
    } catch (err) {
      console.error("Failed to update user:", err);
      if (err.data && err.data.email) {
        setError(err.data.email[0]);
      } else {
        setError("Failed to update user. Please try again.");
      }
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleCancel = () => {
    setEmail(editingUser ? editingUser.email : "");
    setFullName(editingUser ? editingUser.full_name : "");
    setPassword("");
    setDateOfBirth(editingUser ? formatDate(editingUser.date_of_birth) : "");
    setIsActive(editingUser ? editingUser.is_active : true);
    onCancel();
  };

  return (
    <div className="  shadow-[0px_0px_40px_0px_rgba(255,57,176,.5)] mt-4 text-white bg-black rounded-2xl p-8  border-2 border-pink-500">
      <h2 className="text-2xl font-bold mb-4">
        {fromType !== "add" ? `Edit User` : `Add User`}
      </h2>
      <div className="mb-4">
        <label className="block text-sm mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-black border border-gray-600 rounded text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 bg-black border border-gray-600 rounded text-white"
        />
      </div>
      {fromType === "add" && (
        <div className="mb-4">
          <label className="block text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-black border border-gray-600 rounded text-white"
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm mb-2">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full p-2 bg-black border border-gray-600 rounded text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-2">Active Status</label>
        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value === "true")}
          className="w-full p-2 bg-black border border-gray-600 rounded text-white"
        >
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border-2 font-bold text-pink-600 border-pink-600 rounded-lg "
        >
          Cancel
        </button>
        <button
          onClick={fromType === "add" ? handleAddUser : handleUpdateUser}
          className="px-4 py-2 bg-[#C0FF4C] rounded-lg font-bold text-black"
        >
          {fromType !== "add" ? `Update User` : `Add User`}
        </button>
      </div>
    </div>
  );
}
