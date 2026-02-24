import { useEffect, useState, useRef } from "react";
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
  FiPlus,
} from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { Modal } from "@/components/custome/Modal";
import {
  useGetContentsQuery,
  useUploadExcelMutation,
  useDeleteContentMutation,
  useCreateContentMutation,
  useGetTagsQuery,
  useUpdateContentMutation,
} from "@/Redux/services/contentApi";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { userSideUrl } from "@/configtion";

export default function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [fromType, setFromType] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  // Debounce search term to avoid too many API calls
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Fetch contents with search term
  const { data, error, isLoading } = useGetContentsQuery({
    search: debouncedSearchTerm,
  });

  // Upload Excel mutation
  const [uploadExcel, { isLoading: isUploading }] = useUploadExcelMutation();
  const excelInputRef = useRef(null);
  // Delete content mutation
  const [deleteContent, { isLoading: isDeleting }] = useDeleteContentMutation();
  // Extract results from API response
  const contentData = data || [];

  useEffect(() => {
    setFromType("add");
  }, []);

  // Reset display limit when search term or filters change
  useEffect(() => {
    setDisplayLimit(10);
  }, [debouncedSearchTerm, typeFilter, statusFilter]);

  // Filter data based on search, type, and status
  const filteredData = contentData.filter((item) => {
    const matchesSearch =
      !debouncedSearchTerm ||
      item.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      item.author?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      item?.content_type?.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get data to display based on current limit
  const displayedData = filteredData.slice(0, displayLimit);

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await uploadExcel(file).unwrap();

        // Show detailed upload results using toast
        const { created, failed, errors, created_records } = result.data;

        if (created > 0 && errors.length === 0) {
          toast.success(
            `Excel file uploaded successfully! ${created} records created.`
          );
        } else if (created > 0 && errors.length > 0) {
          toast.warning(
            `Upload completed with issues: ${created} records created, ${errors.length} errors occurred. Check console for details.`
          );
          
        } else if (created === 0 && errors.length > 0) {
          toast.error(
            `Upload failed. ${errors.length} errors occurred. Check console for details.`
          );
          
        } else {
          toast.success("Excel file uploaded successfully!");
        }

        // Optionally refetch data to show new records
        // You might want to trigger a refetch here if needed
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload Excel file. Please try again.");
      }
      // clear input value so the same file can be re-uploaded if needed
      try {
        if (excelInputRef.current) excelInputRef.current.value = "";
      } catch (e) {
        // defensive: ignore if clearing fails
      }
    }
  };

  const handleDeleteContent = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (confirmDelete) {
      try {
        await deleteContent(id).unwrap();
        toast.success(`"${title}" has been successfully deleted.`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete content. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div>
        <div className="flex justify-between mb-3 ">
          <div className="text-3xl font-bold text-white mb-2">
            Content Management
          </div>
          <div className="text-sm font-bold text-gray-400 mb-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!isUploading && excelInputRef.current)
                  excelInputRef.current.click();
              }}
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  !isUploading &&
                  excelInputRef.current
                ) {
                  excelInputRef.current.click();
                }
              }}
              className="bg-[#C0FF4C] text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isUploading ? (
                <div className="flex gap-1">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex gap-1">
                  <FiPlus className="text-xl" /> Upload Excel File
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={excelInputRef}
              onChange={handleExcelUpload}
              disabled={isUploading}
              className="hidden"
            />
          </div>
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
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none pl-10 pr-4 py-2 text-white placeholder-gray-500"
            />
          </div>

          <button
            onClick={() => {
              setFromType("add");
              setOpen(true);
            }}
            className="bg-[#C0FF4C] text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" /> Add New Content
          </button>
        </div>

        {/* Table */}
        <div className=" border border-gray-700/50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[linear-gradient(90deg,#C0FF4C66,#99235C66)] text-white">
                <th className="text-left px-6 py-4 font-medium">Title</th>

                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Views</th>
                <th className="text-left px-6 py-4 font-medium">
                  Date Created
                </th>
                <th className="text-left px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-red-400"
                  >
                    Error loading content
                  </td>
                </tr>
              ) : displayedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No content found
                  </td>
                </tr>
              ) : (
                displayedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-700/30 hover:bg-[#2d2440] transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {item.title}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`${
                          item.status.toLowerCase() == "published"
                            ? "bg-green-400/20 text-green-400"
                            : "bg-yellow-600/20 text-yellow-600"
                        }  text-xs px-3 py-1 rounded-full`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">{item.views_count}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              `${userSideUrl}/database/contents/${item.id}`,
                              "_blank"
                            )
                          }
                          className="p-2 bg-blue-500/20 rounded-lg transition-colors group"
                        >
                          <FiEye className="text-blue-400 " />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDetails(item);
                            setDetailsOpen(true);
                          }}
                          className="p-2 bg-purple-500/20 rounded-lg transition-colors group"
                        >
                          <FiCode className="text-purple-400" />
                        </button>
                        <button
                          onClick={() => {
                            setFromType("update");
                            setSelectedItem(item);
                            setOpen(true);
                          }}
                          className="p-2 bg-pink-500/20 rounded-lg transition-colors group"
                        >
                          <FaRegEdit className="text-pink-400" />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteContent(item.id, item.title)
                          }
                          disabled={isDeleting}
                          className="p-2 bg-red-500/20 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {filteredData.length > displayLimit && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-[#C0FF4C] text-black font-medium px-6 py-2 rounded-lg transition-colors hover:bg-[#C0FF4C]/80"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <Modal open={open} className="max-w-2xl " onOpenChange={setOpen}>
        <ContentForm
          fromType={fromType}
          data={selectedItem}
          onClose={() => {
            setOpen(false);
            setSelectedItem(null);
          }}
        />
      </Modal>
      <Modal
        open={detailsOpen}
        className="max-w-2xl "
        onOpenChange={setDetailsOpen}
      >
        <ContentDetails
          data={selectedDetails}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedDetails(null);
          }}
        />
      </Modal>
    </div>
  );
}

export function ContentForm({ fromType, data, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: null,
    type_of_content: "",
    genre: "",
    period: "",
    region: "",
    movement: "",
    theoretical: "",
    theme: "",
    type_of_contribution: "",
    function: "",
    language: "",
    country_of_content: "",
    description: "",
    source_url: "",
    media_embedded_url: "",
    eligible_for_free_chapter: false,
    thumbnail_image: null,
    uploads: [],
    upload_images: [],
    tags: [],
    status: "",
  });

  useEffect(() => {
    if (fromType === "update" && data) {
      setFormData({
        title: data.title || "",
        author: data.author || "",
        year: data.year || null,
        type_of_content: data.type_of_content_title || "",
        genre: data.genre_title || "",
        period: data.period_title || "",
        region: data.region_title || "",
        movement: data.movement_title || "",
        theoretical: data.theoretical_title || "",
        theme: data.theme_title || "",
        type_of_contribution: data.type_of_contribution_title || "",
        function: data.function_title || "",
        language: data.language_title || "",
        country_of_content: data.country_of_content_title || "",
        description: data.description || "",
        source_url: data.source_url || "",
        media_embedded_url: data.media_embedded_url || "",
        eligible_for_free_chapter: data.eligible_for_free_chapter || false,
        thumbnail_image: data.thumbnail_image || null,
        uploads: data.uploads || [],
        upload_images: data.upload_images || [],
        status: data.status || "",
      });
    }
  }, [data]);
  const [imagePreview, setImagePreview] = useState(null);
  const [featureImagePreview, setFeatureImagePreview] = useState(null);
  const [pdfName, setPdfName] = useState("");

  // Fetch tags
  const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery();
  const [createContent, { isLoading: isCreating }] = useCreateContentMutation();
  const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation();

  const tagOptions =
    tagsData?.data?.map((tag) => ({ value: tag.id, label: tag.name })) || [];

  const getEmbedUrl = (url) => {
    if (!url) return "";
    // YouTube watch URL
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // YouTube short URL
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo URL
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1].split("?")[0].split("/")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // If already embed or other platform, return as is
    return url;
  };
  // Handle PDF upload
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, pdf: file }));
      setPdfName(file.name);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Feature image handlers
  const handleFeatureImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail_image: file }));
      setFeatureImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFeatureImage = () => {
    setFormData((prev) => ({ ...prev, thumbnail_image: null }));
    setFeatureImagePreview(null);
  };

  // Remove PDF
  const handleRemovePdf = () => {
    setFormData((prev) => ({ ...prev, pdf: null }));
    setPdfName("");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    
    onClose();
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        year: formData.year,
        type_of_content: formData.type_of_content,
        genre: formData.genre,
        period: formData.period,
        region: formData.region,
        movement: formData.movement,
        theoretical: formData.theoretical,
        theme: formData.theme,
        type_of_contribution: formData.type_of_contribution,
        function: formData.function,
        language: formData.language,
        country_of_content: formData.country_of_content,
        description: formData.description,
        source_url: formData.source_url,
        media_embedded_url: formData.media_embedded_url,
        eligible_for_free_chapter: formData.eligible_for_free_chapter,
        thumbnail_image: formData.thumbnail_image,
        uploads: formData.uploads,
        upload_images: formData.upload_images,
        status: formData.status,
      };
      
      const result = await updateContent({
        id: data.id,
        data: payload,
      }).unwrap();
      
      toast.success("Content updated successfully");
      // close modal
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Update content failed:", err);
      toast.error("Failed to update content. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    // For add flow, create content via API
    if (fromType !== "add") {
      handleUpdate();
      return;
    }

    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        year: formData.year,
        type_of_content: formData.type_of_content,
        genre: formData.genre,
        period: formData.period,
        region: formData.region,
        movement: formData.movement,
        theoretical: formData.theoretical,
        theme: formData.theme,
        type_of_contribution: formData.type_of_contribution,
        function: formData.function,
        language: formData.language,
        country_of_content: formData.country_of_content,
        description: formData.description,
        source_url: formData.source_url,
        media_embedded_url: formData.media_embedded_url,
        eligible_for_free_chapter: formData.eligible_for_free_chapter,
        thumbnail_image: formData.thumbnail_image,
        uploads: formData.uploads,
        upload_images: formData.upload_images,
        status: formData.status,
      };
      
      const result = await createContent(payload).unwrap();
      
      toast.success("Content created successfully");
      // close modal
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Create content failed:", err);
      toast.error("Failed to create content. Please try again.");
    }
  };

  return (
    <div className="w-full  p-4">
      <div className="w-full  shadow-[0px_0px_40px_0px_rgba(255,57,176,.5)] bg-black rounded-2xl p-8  border-2 border-pink-500">
        <h1 className="text-white text-3xl font-bold mb-6">
          {fromType === "add" ? `Add New Content` : `Edit Content`}
        </h1>

        <div className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Author Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Year Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Type Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Type of Content
            </label>
            <input
              type="text"
              name="type_of_content"
              value={formData.type_of_content || ""}
              onChange={handleChange}
              placeholder="Enter content type (e.g., PDF, Video, Image)"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Genre Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Period Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Period</label>
            <input
              type="text"
              name="period"
              value={formData.period || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Region Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Region</label>
            <input
              type="text"
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Movement Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Movement</label>
            <input
              type="text"
              name="movement"
              value={formData.movement || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Theoretical Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Theoretical
            </label>
            <input
              type="text"
              name="theoretical"
              value={formData.theoretical || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Theme Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Theme</label>
            <input
              type="text"
              name="theme"
              value={formData.theme || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Type of Contribution Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Type of Contribution
            </label>
            <input
              type="text"
              name="type_of_contribution"
              value={formData.type_of_contribution || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Function Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Function</label>
            <input
              type="text"
              name="function"
              value={formData.function || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Language Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Language</label>
            <input
              type="text"
              name="language"
              value={formData.language || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Country of Content Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Country of Content
            </label>
            <input
              type="text"
              name="country_of_content"
              value={formData.country_of_content || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Description Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description here..."
              rows="3"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder-gray-500"
            />
          </div>
          {/* Source URL Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Source URL
            </label>
            <input
              type="url"
              name="source_url"
              value={formData.source_url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Media Embedded URL Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Media Embedded URL
            </label>
            <input
              type="url"
              name="media_embedded_url"
              value={formData.media_embedded_url}
              onChange={handleChange}
              placeholder="https://example.com/embed"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Eligible for Free Chapter Checkbox */}
          <div>
            <label className="flex items-center text-gray-300 text-sm">
              <input
                type="checkbox"
                name="eligible_for_free_chapter"
                checked={formData.eligible_for_free_chapter || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    eligible_for_free_chapter: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              Eligible for Free Chapter
            </label>
          </div>
          {/* Tags Select */}
          <div className="hidden">
            <label className="block text-gray-300 text-sm mb-2">Tags</label>
            <Select
              isMulti
              options={tagOptions}
              value={tagOptions.filter((option) =>
                (formData.tags || []).includes(option.value)
              )}
              onChange={(selectedOptions) => {
                const selectedIds = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : [];
                setFormData((prev) => ({ ...prev, tags: selectedIds }));
              }}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#18181b", // zinc-900
                  borderColor: "#3f3f46", // zinc-700
                  "&:hover": {
                    borderColor: "#ec4899", // pink-500
                  },
                  "&:focus-within": {
                    borderColor: "#ec4899",
                    boxShadow: "0 0 0 1px #ec4899",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#18181b",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#ec4899"
                    : state.isFocused
                    ? "#27272a"
                    : "#18181b",
                  color: "white",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#ec4899",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#be185d",
                  },
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#9ca3af", // gray-400
                }),
              }}
            />
          </div>
          {/* Status Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Enter status"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* Feature Image Upload */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Feature Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFeatureImageChange}
              className="w-full text-gray-300 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-pink-600 file:text-white file:cursor-pointer hover:file:bg-pink-700"
            />
            {featureImagePreview && (
              <div className="mt-3 flex flex-row  sm:flex-row sm:items-start gap-3">
                <img
                  src={featureImagePreview}
                  alt="Feature Preview"
                  className="rounded-lg w-full sm:w-72 max-h-60 object-cover border border-zinc-700"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveFeatureImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Remove Feature Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Upload */}
          {/* Content Textarea */}
          {/* <div>
            <label className="block text-gray-300 text-sm mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter content or description here..."
              rows="5"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder-gray-500"
            />
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border-2 border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className={`px-6 py-2.5 rounded-lg font-medium  transition-colors ${
              isCreating
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#C0FF4C] text-black"
            }`}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black inline-block mr-2" />
                Creating...
              </>
            ) : fromType === "add" ? (
              `Add Content`
            ) : (
              ` Update Content`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContentDetails({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="w-full p-4">
      <div className="w-full shadow-[0px_0px_40px_0px_rgba(255,57,176,.5)] bg-black rounded-2xl p-8 border-2 border-pink-500">
        <h1 className="text-white text-3xl font-bold mb-6">Content Details</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Title</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Author</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.author || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Year</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.year || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Type of Content
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.type_of_content_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Genre</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.genre_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Period</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.period_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Region</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.region_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Movement</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.movement_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Theoretical
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.theoretical_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Theme</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.theme_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Type of Contribution
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.type_of_contribution_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Function</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.function_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Language</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.language_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Country of Content
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.country_of_content_title || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Description
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.description || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Source URL
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.source_url || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Media Embedded URL
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.media_embedded_url || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Eligible for Free Chapter
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.eligible_for_free_chapter ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Status</label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.status || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Views Count
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {data.views_count || 0}
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Created At
            </label>
            <p className="text-white bg-zinc-900 rounded-lg px-4 py-3">
              {new Date(data.created_at).toLocaleDateString() || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-500 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
