import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { useData } from "../../../context/DataContext";

import useCursorPagination from "../../../hooks/useCursorPagination";
import { useDialog } from "../../../context/DialogContext";

const Youtube = () => {
  const { addYoutubeLink, deleteYoutubeLink } = useData();
  const { confirm } = useDialog();
  const [linkInput, setLinkInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: youtubeLinks,
    loading: loadingYoutubeLinks,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshYoutubeLinks,
  } = useCursorPagination("/api/youtube", {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined,
    },
  });

  const handleError = (error) => {
    console.error("Action error:", error);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (linkInput.trim()) {
      try {
        await addYoutubeLink({ url: linkInput.trim() });
        refreshYoutubeLinks();
        setLinkInput("");
      } catch (e) {
        handleError(e);
      }
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This YouTube link will be permanently removed.", {
      title: "Delete YouTube Link?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await deleteYoutubeLink(id);
      refreshYoutubeLinks();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Search */}
        <div className="w-full md:w-1/3 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Form */}
        <div className="w-full md:w-2/3">
          <form onSubmit={handleAddLink} className="flex gap-2 w-full">
            <input
              type="url"
              className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="Paste YouTube link here..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary-gradient text-white rounded-lg text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              Add Link
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {loadingYoutubeLinks && youtubeLinks.length === 0 ? (
          <div className="flex justify-center flex-col items-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-gray-500 font-medium mt-4">Loading links...</h3>
          </div>
        ) : youtubeLinks.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-gray-50/50">
                  <tr className="border-b-2 border-gray-100">
                    <th className="px-6 py-4 font-semibold text-secondary w-16">
                      #
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary">
                      YouTube Link
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary text-right w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {youtubeLinks.map((link, index) => {
                    return (
                      <tr
                        key={link._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm font-medium truncate max-w-md block"
                          >
                            {link.url}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                            onClick={() => handleDelete(link._id)}
                            title="Delete link"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingYoutubeLinks}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
              >
                <ChevronLeft size={16} className="inline mr-1 -mt-0.5" />{" "}
                Previous
              </button>
              <span className="text-sm font-medium text-gray-500">
                {loadingYoutubeLinks
                  ? "Loading..."
                  : `Page ${pageInfo.hasPrevPage ? "..." : "1"}`}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingYoutubeLinks}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
              >
                Next <ChevronRight size={16} className="inline ml-1 -mt-0.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <YoutubeIcon size={64} className="mb-4 opacity-50 text-gray-400" />
            <h3 className="text-xl font-bold text-secondary mb-2">
              No YouTube links
            </h3>
            <p className="text-sm">
              Start by adding your first YouTube link above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Youtube;
