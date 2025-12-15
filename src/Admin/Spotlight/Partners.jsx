// -------------------- Partners Component --------------------

import {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useDeletePartnerMutation,
} from "@/Redux/services/partnersApi";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { SlCloudUpload } from "react-icons/sl";

export default function Partners() {
  const { data: partnersData, isLoading, error } = useGetPartnersQuery();
  const [createPartner] = useCreatePartnerMutation();
  const [deletePartner] = useDeletePartnerMutation();

  const [open, setOpen] = useState(false);

  const handleDelete = async (id) => {
    try {
      await deletePartner(id).unwrap();
    } catch (err) {
      console.error("Failed to delete partner:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading partners</div>;

  const partners = partnersData?.data || [];

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setOpen(true)}
          className="flex justify-center items-center gap-2 px-4 py-2 rounded transition-colors text-sm font-medium bg-[#c8ff00] text-purple-950 hover:bg-[#b3e600]"
        >
          <FaPlus /> Add New Partner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[linear-gradient(90deg,#C0FF4C66,#99235C66)] text-white">
              <th className="text-left py-4 px-4  font-medium text-sm">
                Partners Logo
              </th>
              <th className="text-left py-4 px-4  font-medium text-sm">Name</th>
              <th className="text-left py-4 px-4  font-medium text-sm">
                Date Created
              </th>
              <th className="text-left py-4 px-4  font-medium text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
              >
                <td className="py-4 px-4 text-white font-medium flex items-center gap-4">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="w-24 object-contain"
                  />
                </td>

                <td className="py-4 px-4 text-white text-sm">{p.name}</td>
                <td className="py-4 px-4 text-white text-sm">
                  {new Date().toISOString().slice(0, 10)}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PartnerModal
        open={open}
        onOpenChange={setOpen}
        createPartner={createPartner}
      />
    </div>
  );
}
// -------------------- PartnerModal Component --------------------
function PartnerModal({ open, onOpenChange, createPartner }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleAdd = async () => {
    if (!file || !name) return;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("logo", file);
      await createPartner(formData).unwrap();
      setFile(null);
      setName("");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create partner:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-black text-white p-6 rounded-2xl border-2 border-pink-500 shadow-[0_0_40px_rgba(255,57,176,.5)] w-[600px]">
        <h3 className="text-xl font-bold  mb-4">Upload Partners logo</h3>
        <div className="border-2 border-dashed border-gray-700 rounded p-6 flex flex-col items-center gap-4">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="max-h-40 object-contain"
            />
          ) : (
            <>
              {" "}
              <div className="">
                {" "}
                <label className="text-pink-400  cursor-pointer ">
                  <div className="flex justify-center items-center">
                    <SlCloudUpload size={60} />
                  </div>
                  <span className="text-[#C0FF4C] no-underline">
                    Drag & drop files or{" "}
                  </span>
                  <span className="underline">Browse</span>

                  <input type="file" className="hidden" onChange={handleFile} />
                </label>
              </div>
            </>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Partner name"
            className="w-full bg-transparent border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => {
              onOpenChange(false);
              setFile(null);
            }}
            className="px-4 py-2 rounded border border-pink-500"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-[#C0FF4C] text-black font-bold"
          >
            Add Partner
          </button>
        </div>
      </div>
    </div>
  );
}
