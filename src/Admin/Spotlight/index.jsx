import { useState } from "react";
import { FiInfo, FiTarget } from "react-icons/fi";
import Highlight from "./Highlight";
import Partners from "./Partners";
import HighlightBlog from "./HighlightBlog";
import HighlightArticle from "./HighlightArticle";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("highlight");

  const tabs = [
    { id: "highlight", label: "Content Highlight", icon: FiTarget },
    { id: "blog-highlight", label: "Blog Highlight", icon: FiTarget },
    { id: "article-highlight", label: "Article Highlight", icon: FiTarget },
    { id: "partners", label: "Partners", icon: FiInfo },
  ];

  return (
    <div className="min-h-screen">
      <div>
        {/* Header */}
        <h1 className="text-3xl font-bold text-white pt-0 mt-0 mb-8">
          Settings
        </h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-2 transition-colors relative ${
                  activeTab === tab.id ? "text-lime-400" : " text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm  font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400" />
                )}
              </button>
            );
          })}
        </div>
        {activeTab === "highlight" ? (
          <Highlight />
        ) : activeTab === "blog-highlight" ? (
          <HighlightBlog />
        ) : activeTab === "article-highlight" ? (
          <HighlightArticle />
        ) : activeTab === "partners" ? (
          <Partners />
        ) : null}
      </div>
    </div>
  );
}

// -------------------- Highlight Content Component --------------------
