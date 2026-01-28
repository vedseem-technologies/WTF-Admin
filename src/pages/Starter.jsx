import { useState } from 'react';
import { useData } from '../context/DataContext';
import './Starter.css';

const Starter = () => {
    const { menuItems } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [addedItems, setAddedItems] = useState([]);

    // Filter items for Starter category (category ID = 1)
    const starterItems = menuItems.filter(item => item.category === 1);

    // Filter by search term
    const filteredItems = starterItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddItem = (item) => {
        // Check if item is already added
        if (!addedItems.find(i => i.id === item.id)) {
            setAddedItems([...addedItems, item]);
        }
    };

    const handleRemoveItem = (itemId) => {
        setAddedItems(addedItems.filter(item => item.id !== itemId));
    };

    return (
        <div className="starter-page">
            <div className="page-header">
                <h2 className="page-title-big">🥗 Starter Items</h2>
                <p className="page-description">Browse and add starter items to your selection</p>
            </div>

            <div className="starter-layout">
                {/* Left Panel - Items Table */}
                <div className="items-panel">
                    <div className="search-section">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="🔍 Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="items-table-container">
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Item Name</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="item-image-cell">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                        </td>
                                        <td className="item-name">{item.name}</td>
                                        <td>
                                            <span className={`type-badge ${item.type.toLowerCase()}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="item-price">₹{item.price}</td>
                                        <td>
                                            <button
                                                className="add-btn"
                                                onClick={() => handleAddItem(item)}
                                                disabled={addedItems.find(i => i.id === item.id)}
                                            >
                                                {addedItems.find(i => i.id === item.id) ? '✓ Added' : 'Add'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredItems.length === 0 && (
                            <div className="empty-message">
                                <span className="empty-icon">🔍</span>
                                <p>No items found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Added Items */}
                <div className="added-panel">
                    <h3 className="added-title">Added Items</h3>
                    <div className="added-items-grid">
                        {addedItems.map((item) => (
                            <div key={item.id} className="added-item-card">
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(item.id)}
                                    title="Remove item"
                                >
                                    ×
                                </button>
                                <div className="card-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="card-info">
                                    <h4>{item.name}</h4>
                                    <p className="card-price">₹{item.price}</p>
                                </div>
                            </div>
                        ))}

                        {addedItems.length === 0 && (
                            <div className="empty-added">
                                <span className="empty-icon">📋</span>
                                <p>No items added yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Starter;
