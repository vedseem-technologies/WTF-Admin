import { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import './Youtube.css';
import useCursorPagination from '../../../hooks/useCursorPagination';

const Youtube = () => {
    const { addYoutubeLink, deleteYoutubeLink } = useData();
    const [linkInput, setLinkInput] = useState('');
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
        refresh: refreshYoutubeLinks
    } = useCursorPagination('/api/youtube', {
        limit: 12,
        filters: {
            search: debouncedSearchTerm || undefined
        }
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
                setLinkInput('');
            } catch (e) { handleError(e); }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this YouTube link?')) {
            try {
                await deleteYoutubeLink(id);
                refreshYoutubeLinks();
            } catch (e) { handleError(e); }
        }
    };

    return (
        <div className="page-container">
            <div className="page-filters" style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Search links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="add-link-section">
                <form onSubmit={handleAddLink} className="add-link-form">
                    <input
                        type="url"
                        className="form-control link-input"
                        placeholder="Paste YouTube link here..."
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary add-btn">
                        Add
                    </button>
                </form>
            </div>

            <div className="table-container">
                {loadingYoutubeLinks && youtubeLinks.length === 0 ? (
                    <div className="loading-state">
                        <h3>...loading</h3>
                    </div>
                ) : youtubeLinks.length > 0 ? (
                    <>
                        <table className="table youtube-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>YouTube Link</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {youtubeLinks.map((link, index) => {
                                    return (
                                        <tr key={link._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="youtube-link"
                                                >
                                                    {link.url}
                                                </a>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(link._id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="pagination-controls flex justify-between items-center mt-8 mb-8">
                            <button
                                onClick={handlePrev}
                                disabled={!pageInfo.hasPrevPage || loadingYoutubeLinks}
                                className="btn btn-outline"
                            >
                                ⬅️ Previous
                            </button>
                            <span className="text-gray-500">
                                {loadingYoutubeLinks ? 'Loading...' : ''}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={!pageInfo.hasNextPage || loadingYoutubeLinks}
                                className="btn btn-outline"
                            >
                                Next ➡️
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">🎥</span>
                        <h3>No YouTube links added</h3>
                        <p>Start by adding your first YouTube link above</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Youtube;
