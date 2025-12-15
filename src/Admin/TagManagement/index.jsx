"use client";

import { Modal } from "@/components/custome/Modal";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiX, FiPlus } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "@/Redux/services/tagsApi";

export default function TagManagement() {
  const { data: tagsData, isLoading, error } = useGetTagsQuery();
  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const [assignedTags, setAssignedTags] = useState([
    { id: 2, name: "Security" },
    { id: 3, name: "Tutorial" },
  ]);

  const [draggedTag, setDraggedTag] = useState(null);
  const [fromType, setFromType] = useState("add");
  const [editingTag, setEditingTag] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFromType("add");
  }, []);
  useEffect(() => {
    !open && setEditingTag("");
  }, [open]);

  const tags = tagsData?.data || [];

  const handleDragStart = (tag) => {
    setDraggedTag(tag);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedTag && !assignedTags.find((t) => t.id === draggedTag.id)) {
      setAssignedTags([...assignedTags, draggedTag]);
    }
    setDraggedTag(null);
  };

  const removeTag = (tagId) => {
    setAssignedTags(assignedTags.filter((t) => t.id !== tagId));
  };

  const handleEdit = (tag) => {
    setFromType("edit");
    setEditingTag(tag);
    setOpen(true);
  };

  const handleDelete = async (tagId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tag?");
    if (!confirmDelete) return;

    try {
      await deleteTag(tagId).unwrap();
      toast.success("Tag deleted successfully!");
    } catch (err) {
      console.error("Failed to delete tag:", err);
      toast.error("Failed to delete tag. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tags</div>;

  return (
    <div className="min-h-screen  ">
      {/* <ToastContainer theme="dark" /> */}
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Tag Management</h1>
          <button
            onClick={() => {
              setFromType("add");
              setOpen(true);
            }}
            className="bg-[#c4ff0d] text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-[#b0e600] transition-colors flex items-center gap-2"
          >
            <FiPlus className="text-xl" />
            Add New Tag
          </button>
        </div>

        {/* Tag Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-[#0F0F0F] border border-[#FF39B04D] rounded-lg p-6 transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white text-xl font-semibold mb-1">
                    {tag.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {tag.content_count} items
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="text-[#ff0080] bg-[#ff0080]/15 rounded-md hover:text-[#ff3399] transition-colors p-1.5"
                  >
                    <FaRegEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="text-[#ff0040] bg-[#ff0040]/15 rounded-md hover:text-[#ff3366] transition-colors p-1.5"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tag Assignment Section */}
        {/* <div className="bg-[#0F0F0F] border  border-gray-600/50  rounded-lg p-6"> */}
          {/* <h2 className="text-white text-2xl font-bold mb-2">Tag Assignment</h2>
          <p className="text-gray-400 mb-6">
            Drag and drop tags to assign them to content.
          </p> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Tags */}
            {/* <div className=" shadow-lg shadow-gray-800/50 border border-gray-800/50 p-6">
              <h3 className="text-white font-semibold mb-4">Available Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    draggable
                    onDragStart={() => handleDragStart(tag)}
                    className=" border border-[#FF39B04D] text-white px-4 py-2 rounded-full text-sm cursor-move ] transition-colors"
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div> */}

            {/* Assigned Tags */}
            {/* <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 shadow-sm border-dashed border-[#2a1f3d] rounded-lg p-4 min-h-[150px]"
            >
              <h3 className="text-white font-semibold mb-4">
                Content: Introduction to Cybersecurity
              </h3>
              <div className="flex flex-wrap gap-2">
                {assignedTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="bg-[#ff0080]/20 text-[#ff3399]  px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag.name}
                    <button
                      onClick={() => removeTag(tag.id)}
                      className="text-[#ff3399] rounded-full p-0.5 transition-colors"
                    >
                      <FiX className="text-base" />
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        {/* </div> */}
      </div>
      {/* <button onClick={() => setOpen(true)}>Open Modal</button> */}
      <Modal open={open} className="max-w-2xl  p-4 " onOpenChange={setOpen}>
        {/* <ContentForm />
         */}
        <AddTag
          fromType={fromType}
          onCancel={() => setOpen(false)}
          editingTag={editingTag}
          createTag={createTag}
          updateTag={updateTag}
        />
      </Modal>
    </div>
  );
}

// import React, { useState } from "react";

export function AddTag({
  fromType,
  onChange,
  onCancel,
  editingTag,
  createTag,
  updateTag,
}) {
  const [tagName, setTagName] = useState(editingTag ? editingTag.name : "");

  const handleAddTag = async () => {
    if (!tagName.trim()) return;
    try {
      if (fromType === "add") {
        await createTag({ name: tagName }).unwrap();
        toast.success("Tag created successfully!");
      } else {
        await updateTag({ id: editingTag.id, name: tagName }).unwrap();
        toast.success("Tag updated successfully!");
      }
      setTagName("");
      onCancel();
    } catch (err) {
      console.error("Failed to save tag:", err);
      toast.error("Failed to save tag. Please try again.");
    }
  };

  const handleCancel = () => {
    
    onCancel();
    setTagName("");
  };

  return (
    <div className="  shadow-[0px_0px_40px_0px_rgba(255,57,176,.5)] mt-4 text-white bg-black rounded-2xl p-8  border-2 border-pink-500">
      <h2 className="text-2xl text-white font-bold mb-4">
        {fromType !== "add" ? `Edit Tag` : `Add New Tag`}
      </h2>
      <div className="mb-4">
        <label className="block text-sm mb-2">{`Tag Name`}</label>
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="w-full p-2 bg-black border border-gray-600 rounded text-white"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border-2 font-bold text-pink-600 border-pink-600 rounded-lg "
        >
          Cancel
        </button>
        <button
          onClick={handleAddTag}
          className="px-4 py-2 bg-[#C0FF4C] rounded-lg font-bold text-black"
        >
          {fromType !== "add" ? `Update Tag` : ` Add Tag`}
        </button>
      </div>
    </div>
  );
}
