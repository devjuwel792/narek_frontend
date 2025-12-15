import { useEffect, useState } from "react";
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
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useCreateBlogMutation,
  useGetTagsQuery,
  useUpdateBlogMutation,
} from "@/Redux/services/blogApi";
import { useDebounce } from "use-debounce";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { userSideUrl } from "@/configtion";

export default function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [fromType, setFromType] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [isUploading, setIsUploading] = useState(false);

  // Debounce search term to avoid too many API calls
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Fetch blogs with search term
  const { data, error, isLoading } = useGetBlogsQuery({
    search: debouncedSearchTerm,
  });

  // Delete blog mutation
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  // Extract results from API response
  const blogData = data?.data?.results || [];

  useEffect(() => {
    setFromType("add");
  }, []);

  // Reset display limit when search term or filters change
  useEffect(() => {
    setDisplayLimit(10);
  }, [debouncedSearchTerm, typeFilter, statusFilter]);

  // Filter data based on type and status (search is handled by API)
  const filteredData = blogData.filter((item) => {
    const matchesSearch =
      !debouncedSearchTerm ||
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      item.tags_name?.some((tag) =>
        tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

    return matchesSearch;
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
          console.log("Upload errors:", errors);
        } else if (created === 0 && errors.length > 0) {
          toast.error(
            `Upload failed. ${errors.length} errors occurred. Check console for details.`
          );
          console.log("Upload errors:", errors);
        } else {
          toast.success("Excel file uploaded successfully!");
        }

        // Optionally refetch data to show new records
        // You might want to trigger a refetch here if needed
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload Excel file. Please try again.");
      }
    }
  };

  const handleDeleteBlog = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (confirmDelete) {
      try {
        await deleteBlog(id).unwrap();
        toast.success(`"${title}" has been successfully deleted.`);
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete blog. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div>
        <div className="flex justify-between mb-3 ">
          <div className="text-3xl font-bold text-white mb-2">
            Blog Management
          </div>
          {/* <div className="text-sm font-bold text-gray-400 mb-2">
            <label className="bg-[#C0FF4C] text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiPlus className="text-xl" /> Upload Excel File
                </>
              )}

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div> */}
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
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none pl-10 pr-4 py-2 text-white placeholder-gray-500"
            />
          </div>

          {/*       <select
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
            <option className="text-black" value="PDF">
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
          </select>*/}

          {/* <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border border-gray-600 rounded-lg px-4 py-2  text-white outline-none cursor-pointer"
          >
            <option className="text-black" value="all">
              All Status
            </option>
            <option className="text-black" value="published">
              Published
            </option>
            <option className="text-black" value="draft">
              Draft
            </option>
            <option className="text-black" value="archived">
              Archived
            </option> 
          </select> */}

          <button
            onClick={() => {
              setFromType("add");
              setOpen(true);
            }}
            className="bg-[#C0FF4C] text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" /> Add New Blog
          </button>
        </div>

        {/* Table */}
        <div className=" border border-gray-700/50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[linear-gradient(90deg,#C0FF4C66,#99235C66)] text-white">
                <th className="text-left px-6 py-4 font-medium">Title</th>
                {/* <th className="text-left px-6 py-4 font-medium">Type</th> */}
                <th className="text-left px-6 py-4 font-medium">Tags</th>
                {/* <th className="text-left px-6 py-4 font-medium">Status</th> */}
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
                    {/* <td className="px-6 py-4">
                      <span
                        className={`${
                          item?.content_type &&
                          item?.content_type?.toLowerCase() == "video"
                            ? "text-pink-400 bg-pink-600/20"
                            : item?.content_type?.toLowerCase() == "pdf"
                            ? "text-red-400 bg-red-600/20"
                            : item?.content_type?.toLowerCase() == "article"
                            ? "text-blue-400 bg-blue-600/20"
                            : item?.content_type?.toLowerCase() == "blog"
                            ? "text-[#C0FF4C] bg-[#C0FF4C]/20"
                            : item?.content_type?.toLowerCase() == "image"
                            ? "text-[#A855F7] bg-[#A855F7]/20"
                            : "text-gray-400 bg-gray-600/20"
                        } t text-xs px-3 py-1 rounded-full`}
                      >
                        {item.content_type}
                      </span>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {item.tags_name?.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium  bg-slate-500/20 text-slate-300 `}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <span
                        className={`${
                          item?.status &&
                          item?.status?.toLowerCase() == "published"
                            ? "bg-green-400/20 text-green-400"
                            : "bg-yellow-600/20 text-yellow-600"
                        }  text-xs px-3 py-1 rounded-full`}
                      >
                        {item.status}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 text-white">{item.views_count}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              `${userSideUrl}/vault-detail/${item.id}`,
                              "_blank"
                            )
                          }
                          className="p-2 bg-blue-500/20 rounded-lg transition-colors group"
                        >
                          <FiEye className="text-blue-400 " />
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
                          onClick={() => handleDeleteBlog(item.id, item.title)}
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

      {/* <button onClick={() => setOpen(true)}>Open Modal</button> */}
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
    </div>
  );
}

export function ContentForm({ fromType, data, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blog_1st_part: "",
    special_quote: "",
    blog_2nd_part: "",
    tags: [],
    primary_image: null,
    blog_image: null,
    author_image: null,
    author_name: "",
    author_bio: "",
  });

  useEffect(() => {
    if (fromType === "update" && data) {
      setFormData({
        title: data.title || "",
        description: data.description || "",
        blog_1st_part: data.blog_1st_part || "",
        special_quote: data.special_quote || "",
        blog_2nd_part: data.blog_2nd_part || "",
        tags: data.tags || [],
        primary_image: null,
        blog_image: null,
        author_image: null,
        author_name: data.author_name || "",
        author_bio: data.author_bio || "",
      });
    }
  }, [data]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState(null);

  // Fetch tags
  const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery();
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const tagOptions =
    tagsData?.data?.map((tag) => ({ value: tag.id, label: tag.name })) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle primary image upload
  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        primary_image: file,
      }));
      setPrimaryImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePrimaryImage = () => {
    setFormData((prev) => ({ ...prev, primary_image: null }));
    setPrimaryImagePreview(null);
  };

  // Handle blog image upload
  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        blog_image: file,
      }));
      setBlogImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveBlogImage = () => {
    setFormData((prev) => ({ ...prev, blog_image: null }));
    setBlogImagePreview(null);
  };

  // Handle author image upload
  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        author_image: file,
      }));
      setAuthorImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAuthorImage = () => {
    setFormData((prev) => ({ ...prev, author_image: null }));
    setAuthorImagePreview(null);
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
  };

  const handleUpdate = async () => {
    try {
      const result = await updateBlog({
        id: data.id,
        data: formData,
      }).unwrap();
      console.log("Update blog result:", result);
      toast.success("Blog updated successfully");
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Update blog failed:", err);
      toast.error("Failed to update blog. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    if (fromType !== "add") {
      handleUpdate();
      return;
    }

    try {
      const result = await createBlog(formData).unwrap();
      console.log("Create blog result:", result);
      toast.success("Blog created successfully");
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Create blog failed:", err);
      toast.error("Failed to create blog. Please try again.");
    }
  };

  return (
    <div className="w-full  p-4">
      <div className="w-full  shadow-[0px_0px_40px_0px_rgba(255,57,176,.5)] bg-black rounded-2xl p-8  border-2 border-pink-500">
        <h1 className="text-white text-3xl font-bold mb-6">
          {fromType === "add" ? `Add New Blog` : `Edit Blog`}
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
          {/* Description */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter blog description..."
              rows="3"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder-gray-500"
            />
          </div>
          {/* Blog 1st Part */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Blog 1st Part
            </label>
            <textarea
              name="blog_1st_part"
              value={formData.blog_1st_part}
              onChange={handleChange}
              placeholder="Enter first part of the blog..."
              rows="5"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder-gray-500"
            />
          </div>
          {/* Special Quote */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Special Quote
            </label>
            <input
              type="text"
              name="special_quote"
              value={formData.special_quote}
              onChange={handleChange}
              placeholder="Enter special quote..."
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Blog 2nd Part */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Blog 2nd Part
            </label>
            <textarea
              name="blog_2nd_part"
              value={formData.blog_2nd_part}
              onChange={handleChange}
              placeholder="Enter second part of the blog..."
              rows="5"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder-gray-500"
            />
          </div>
          {/* Author Name */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Author Name
            </label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              placeholder="Enter author name..."
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {/* Author Bio */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Author Bio
            </label>
            <textarea
              name="author_bio"
              value={formData.author_bio}
              onChange={handleChange}
              placeholder="Enter author bio..."
              rows="3"
              className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder-gray-500"
            />
          </div>
          {/* Tags Select */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Tags</label>
            <Select
              isMulti
              options={tagOptions}
              value={tagOptions.filter((option) =>
                formData.tags.includes(option.value)
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
          {/* Primary Image Upload */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePrimaryImageChange}
              className="w-full text-gray-300 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-pink-600 file:text-white file:cursor-pointer hover:file:bg-pink-700"
            />
            {primaryImagePreview && (
              <div className="mt-3 flex flex-row  sm:flex-row sm:items-start gap-3">
                <img
                  src={primaryImagePreview}
                  alt="Primary Preview"
                  className="rounded-lg w-full sm:w-72 max-h-60 object-cover border border-zinc-700"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemovePrimaryImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Remove Primary Image
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Blog Image Upload */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Blog Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBlogImageChange}
              className="w-full text-gray-300 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-pink-600 file:text-white file:cursor-pointer hover:file:bg-pink-700"
            />
            {blogImagePreview && (
              <div className="mt-3 flex flex-row  sm:flex-row sm:items-start gap-3">
                <img
                  src={blogImagePreview}
                  alt="Blog Preview"
                  className="rounded-lg w-full sm:w-72 max-h-60 object-cover border border-zinc-700"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveBlogImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Remove Blog Image
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Author Image Upload */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Author Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAuthorImageChange}
              className="w-full text-gray-300 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-pink-600 file:text-white file:cursor-pointer hover:file:bg-pink-700"
            />
            {authorImagePreview && (
              <div className="mt-3 flex flex-row  sm:flex-row sm:items-start gap-3">
                <img
                  src={authorImagePreview}
                  alt="Author Preview"
                  className="rounded-lg w-full sm:w-72 max-h-60 object-cover border border-zinc-700"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveAuthorImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Remove Author Image
                  </button>
                </div>
              </div>
            )}
          </div>
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
              `Add Blog`
            ) : (
              `Update Blog`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
