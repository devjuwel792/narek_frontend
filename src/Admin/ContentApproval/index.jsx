// import React from "react";

// export default UserManagement;

import { Modal } from "@/components/custome/Modal";
import { useEffect, useState } from "react";
import { BiShield, BiShieldX } from "react-icons/bi";
import { FaRegEdit, FaTimes } from "react-icons/fa";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { FaCheck, FaRegEye } from "react-icons/fa6";

export default function ContentApproval() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [fromType, setFromType] = useState("add");
  const userData = [
    {
      id: 1,
      title: "Blockchain Technology Overview",
      type: "Article",
      submittedBy: "Admin",
      dateSubmitted: "2025-09-15",
      actions: ["view", "approve", "delete"],
    },
    {
      id: 2,
      title: "Cybersecurity Best Practices",
      type: "PDF",
      submittedBy: "Admin",
      dateSubmitted: "2025-09-15",
      actions: ["view", "approve", "delete"],
    },
    {
      id: 3,
      title: "Neural Network Architecture",
      type: "Video",
      submittedBy: "Admin",
      dateSubmitted: "2025-09-15",
      actions: ["view", "approve", "delete"],
    },
    {
      id: 4,
      title: "Digital Art Creation",
      type: "Blog",
      submittedBy: "Admin",
      dateSubmitted: "2025-09-15",
      actions: ["view", "approve", "delete"],
    },
  ];

  useEffect(() => {
    setFromType("add");
  }, []);

  return (
    <div className="relative">
      <div>
        <div className="">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Content Approval</h1>
            <p className="text-gray-400"> items awaiting approval</p>
          </div>
        </div>

        <div className="bg-[#1a0e1e] p-6 rounded-xl border border-gray-700/50 mb-6">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-6  border border-gray-700/50 rounded-lg p-4">
            <div className="flex-1 relative ">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
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
                All Types
              </option>
              <option className="text-black" value="video">
                Video
              </option>
              <option className="text-black" value="pdf">
                PDF
              </option>
              <option className="text-black" value="article">
                Article
              </option>
              <option className="text-black" value="blog">
                Blog
              </option>
              <option className="text-black" value="image">
                Image
              </option>
            </select>
          </div>

          {/* Table */}
          <div className=" border border-gray-700/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[linear-gradient(90deg,#C0FF4C66,#99235C66)] text-white">
                  <th className="text-left px-6 py-4 font-medium">Title</th>
                  <th className="text-left px-6 py-4 font-medium">Type</th>
                  <th className="text-left px-6 py-4 font-medium">
                    Submitted By
                  </th>
                  <th className="text-left px-6 py-4 font-medium">
                    Date Submitted
                  </th>
                  <th className="text-left px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData?.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-700/30 hover:bg-[#2d2440] transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 ">
                      {" "}
                      <span
                        className={`${
                          item?.type?.toLowerCase() == "video"
                            ? "text-pink-400 bg-pink-600/20"
                            : item?.type?.toLowerCase() == "pdf"
                            ? "text-red-400 bg-red-600/20"
                            : item?.type?.toLowerCase() == "article"
                            ? "text-blue-400 bg-blue-600/20"
                            : item?.type?.toLowerCase() == "blog"
                            ? "text-[#C0FF4C] bg-[#C0FF4C]/20"
                            : item?.type?.toLowerCase() == "image"
                            ? "text-[#A855F7] bg-[#A855F7]/20"
                            : "text-gray-400 bg-gray-600/20"
                        }  text-xs px-3 py-1 rounded-full`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 text-white">
                        {item?.submittedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {item?.dateSubmitted}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-blue-500/20 rounded-lg transition-colors group">
                          <FaRegEye className="text-blue-400 " />
                        </button>

                        <button
                          onClick={() => {
                            setOpen(true);
                            setFromType("update");
                          }}
                          className="p-2 bg-primary/20 rounded-lg transition-colors group"
                        >
                          <FaCheck className="text-green-400" />
                        </button>

                        <button className="p-2 bg-red-500/20 rounded-lg transition-colors group">
                          <FaTimes className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <button onClick={() => setOpen(true)}>Open Modal</button> */}
      <Modal open={open} className="max-w-2xl  p-4 " onOpenChange={setOpen}>
        {/* <ContentForm />
         */}
        <EditUser fromType={fromType} />
      </Modal>
      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-white text-4xl font-bold">Coming Soon</div>
      </div>
    </div>
  );
}

function EditUser({ fromType }) {




  return (
    <div className="shadow-[0px_0px_40px_0px_rgba(255,57,176,.5)] mt-4 text-white bg-black rounded-2xl p-8  border-2 border-pink-500">
      <h2 className="text-xl font-bold mb-2">
        Content Preview: Blockchain Technology Overview
      </h2>
      <div className="border border-gray-400/50 p-4 rounded-md mb-4">
        <div className="flex border-b border-gray-400/50 pb-4 justify-between items-center mb-2">
          <div className="">
            <p className="text-gray-300">Blockchain Technology Overview</p>
            <p className="text-sm text-gray-400">
              Article - Submitted by Admin on 2025-09-15
            </p>
          </div>
          <span className="text-blue-600 text-sm bg-blue-600/20 px-3 rounded-full cursor-pointer">
            pdf
          </span>
        </div>
        <p className="text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>
      <div className="flex justify-end space-x-4">
        <button className="border-red-500 border text-red-600 px-4 py-2 rounded ">
          Close
        </button>
        <button className="bg-pink-500 flex items-center gap-2 text-white px-4 py-2 rounded ">
          <FaTimes /> Reject
        </button>
        <button className="bg-[#C0FF4C] text-black flex items-center gap-2  px-4 py-2 rounded ">
          <FaCheck /> Approve
        </button>
      </div>
    </div>
  );
}
