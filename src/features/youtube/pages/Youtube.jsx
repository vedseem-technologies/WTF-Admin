import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import './Youtube.css';

const Youtube = () => {
    const { youtubeLinks, loadingYoutubeLinks, addYoutubeLink, deleteYoutubeLink } = useData();
    const [linkInput, setLinkInput] = useState('');

    const handleAddLink = (e) => {
        e.preventDefault();
        if (linkInput.trim()) {
            addYoutubeLink({ url: linkInput.trim() });
            setLinkInput('');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this YouTube link?')) {
            deleteYoutubeLink(id);
        }
    };



    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <h2 className="page-title-big">🎥 YouTube Links</h2>
                    <p className="page-description">Manage YouTube video links</p>
                </div>
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
                {loadingYoutubeLinks ? (
                    <div className="loading-state">
                        <h3>...loading</h3>
                    </div>
                ) : youtubeLinks.length > 0 ? (
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
                                                    className="btn-icon btn-delete"
                                                    onClick={() => handleDelete(link._id)}
                                                    title="Delete"
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
