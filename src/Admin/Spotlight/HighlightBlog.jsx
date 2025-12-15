import { Modal } from "@/components/custome/Modal";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaCirclePlay, FaPlus } from "react-icons/fa6";
import {
  useCreateHighlightBlogMutation,
  useDeleteHighlightBlogMutation,
  useGetHighlightBlogsQuery,
} from "../../Redux/services/highlightBlogApi";
import { useGetBlogsQuery } from "@/Redux/services/blogApi";
export default function HighlightBlog() {
  const { data: highlightsData, isLoading, error } = useGetHighlightBlogsQuery();
  const [createHighlight] = useCreateHighlightBlogMutation();
  const [deleteHighlight] = useDeleteHighlightBlogMutation();
  const [open, setOpen] = useState(false);

  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (highlightsData?.data) {
      const mappedCards = highlightsData?.data?.results.map((item) => ({
        id: item.id,
        title: item.blog.title,
        type: "Blog", // Assuming all are blogs
        views: item.blog.like_count, // Using like_count as views
        image: item.blog.primary_image,
        highlighted: true,
      }));
      setCards(mappedCards);
    }
  }, [highlightsData]);

  const addHighlight = async (item) => {
    try {
      await createHighlight(item.id).unwrap();
    } catch (err) {
      if (err?.data?.message?.includes("Duplicate highlight content")) {
        alert("This content is already highlighted.");
      } else {
        console.error("Failed to create highlight:", err);
        alert("Failed to add highlight. Please try again.");
      }
    }
  };

  const removeCard = async (cardId) => {
    try {
      await deleteHighlight(cardId).unwrap();
      setCards((prev) => prev.filter((card) => card.id !== cardId));
    } catch (err) {
      console.error("Failed to delete highlight:", err);
    }
  };

  return (
    <div className="">
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent"></div> */}
      <div className="flex justify-end mb-10">
        <button
          onClick={() => setOpen(true)}
          className="flex justify-center items-center gap-2 px-4 py-2 rounded transition-colors text-sm font-medium bg-[#c8ff00] text-purple-950 hover:bg-[#b3e600]"
        >
          <FaPlus /> Add Highlight
        </button>
      </div>

      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`group relative  overflow-hidden transition-all duration-300 `}
            >
              <div className="bg-[#2c1b2cd4] border border-[#FF80EB]/50">
                <div className="relative aspect-[4/3] overflow-hidden  flex items-center justify-center">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-[300px] object-cover"
                  />
                </div>

                <div className="text-center pt-2">
                  <h3 className="text-white  font-medium mb-2">{card.title}</h3>
                  <p className="text-pink-400 font-bold text-sm mb-3">
                    {card.type}
                  </p>
                  <div className="flex items-center justify-center text-[#c8ff00] font-semibold pb-4">
                    <FaCirclePlay className="mr-2 text-sm" />
                    <span>{card.views}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-5 py-4 ">
                <button
                  onClick={() => removeCard(card.id)}
                  className="flex-1 px-4 py-2 text-pink-400 border border-pink-500/50 rounded hover:bg-pink-500/10 transition-colors text-sm font-medium"
                >
                  Remove
                </button>             
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={open} className="max-w-4xl  p-4 " onOpenChange={setOpen}>
        <SelectBlog setOpen={setOpen} addHighlight={addHighlight} />
      </Modal>
    </div>
  );
}

function SelectBlog({ setOpen, addHighlight }) {
  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetBlogsQuery({ search: "" });

  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading contents</div>;

  const data =
    blogsData?.data?.results?.map((item) => ({
      id: item.id,
      title: item.title,
      // type: item.content_type,
      status: "Published",
      views: 0,
      dateCreated: new Date().toISOString().slice(0, 10),
    })) || [];



  const filteredData = data
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

  return (
    <div className="  shadow-[0px_0px_40px_0px_rgba(255,57,176,.5)] mt-4 text-white bg-black rounded-2xl p-8  border-2 border-pink-500">
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2  text-sm" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent ring-2 ring-white/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[linear-gradient(90deg,#C0FF4C66,#99235C66)] text-white">
              <th className="text-left py-4 px-4  font-medium text-sm">
                Title
              </th>
              {/* <th className="text-left py-4 px-4  font-medium text-sm">Type</th>
              <th className="text-left py-4 px-4  font-medium text-sm">
                Status
              </th> */}
              <th className="text-left py-4 px-4  font-medium text-sm">
                Views
              </th>
              <th className="text-left py-4 px-4  font-medium text-sm">
                Date Created
              </th>
              <th className="text-left py-4 px-4  font-medium text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
              >
                <td className="py-4 px-4 text-white font-medium">
                  {item.title}
                </td>
                {/* <td className="py-4 px-4">
                  <span
                    className={`${getTypeColor(
                      item.type
                    )}  px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-primary bg-primary/20 px-2 py-1 rounded-full font-medium text-xs">
                    {item.status}
                  </span>
                </td> */}
                <td className="py-4 px-4 text-white text-sm">{item.views}</td>
                <td className="py-4 px-4 text-white text-sm">
                  {item.dateCreated}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => {
                      addHighlight(item);
                      setOpen(false);
                    }}
                    className="bg-[#c8ff00] hover:bg-[#b3e600] text-black px-6 py-1 rounded-md font-medium text-sm transition-colors"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 ">No results found</div>
      )}
    </div>
  );
}
