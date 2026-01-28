// import { useState } from 'react';
// import { useData } from '../context/DataContext';
// import Modal from '../components/common/Modal';
// import './MenuCategories.css';

// const MenuCategories = () => {
//     const { menuCategories, addMenuCategory, updateMenuCategory, deleteMenuCategory, reorderMenuCategories } = useData();

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [formData, setFormData] = useState({ name: '', icon: '' });

//     const sortedCategories = [...menuCategories].sort((a, b) => a.order - b.order);

//     const handleOpenModal = (category = null) => {
//         if (category) {
//             setEditingCategory(category);
//             setFormData({ name: category.name, icon: category.icon });
//         } else {
//             setEditingCategory(null);
//             setFormData({ name: '', icon: '' });
//         }
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingCategory(null);
//         setFormData({ name: '', icon: '' });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (editingCategory) {
//             updateMenuCategory(editingCategory.id, formData);
//         } else {
//             addMenuCategory(formData);
//         }

//         handleCloseModal();
//     };

//     const handleDelete = (id) => {
//         if (window.confirm('Are you sure you want to delete this menu category?')) {
//             deleteMenuCategory(id);
//         }
//     };

//     const moveUp = (index) => {
//         if (index === 0) return;
//         const newCategories = [...sortedCategories];
//         [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
//         newCategories.forEach((cat, idx) => {
//             cat.order = idx + 1;
//         });
//         reorderMenuCategories(newCategories);
//     };

//     const moveDown = (index) => {
//         if (index === sortedCategories.length - 1) return;
//         const newCategories = [...sortedCategories];
//         [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
//         newCategories.forEach((cat, idx) => {
//             cat.order = idx + 1;
//         });
//         reorderMenuCategories(newCategories);
//     };

//     return (
//         <div className="page-container">
//             <div className="page-header">
//                 <div className="page-header-content">
//                     <h2 className="page-title-big">📂 Menu Categories</h2>
//                     <p className="page-description">Organize menu item categories (used in dropdown)</p>
//                 </div>
//                 <button className="btn btn-primary" onClick={() => handleOpenModal()}>
//                     + Add Menu Category
//                 </button>
//             </div>

//             <div className="menu-categories-list">
//                 {sortedCategories.map((category, index) => (
//                     <div key={category.id} className="menu-category-item">
//                         <div className="category-order">#{category.order}</div>
//                         <div className="category-icon">{category.icon}</div>
//                         <div className="category-info">
//                             <h3 className="category-name">{category.name}</h3>
//                             <p className="category-meta">Display order: {category.order}</p>
//                         </div>
//                         <div className="category-controls">
//                             <div className="order-buttons">
//                                 <button
//                                     className="btn btn-sm btn-outline"
//                                     onClick={() => moveUp(index)}
//                                     disabled={index === 0}
//                                     title="Move up"
//                                 >
//                                     ↑
//                                 </button>
//                                 <button
//                                     className="btn btn-sm btn-outline"
//                                     onClick={() => moveDown(index)}
//                                     disabled={index === sortedCategories.length - 1}
//                                     title="Move down"
//                                 >
//                                     ↓
//                                 </button>
//                             </div>
//                             <button
//                                 className="btn btn-sm btn-outline"
//                                 onClick={() => handleOpenModal(category)}
//                             >
//                                 ✏️ Edit
//                             </button>
//                             <button
//                                 className="btn btn-sm btn-danger"
//                                 onClick={() => handleDelete(category.id)}
//                             >
//                                 🗑️ Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {sortedCategories.length === 0 && (
//                 <div className="empty-state">
//                     <span className="empty-icon">📂</span>
//                     <h3>No menu categories found</h3>
//                     <p>Add categories to organize your menu items</p>
//                 </div>
//             )}

//             <Modal
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 title={editingCategory ? 'Edit Menu Category' : 'Add New Menu Category'}
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Category Name *</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="e.g., Starter, Main Course, Dessert"
//                             value={formData.name}
//                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Icon/Emoji *</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="e.g., 🥗 🍛 🍰"
//                             value={formData.icon}
//                             onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
//                             required
//                             maxLength={2}
//                         />
//                         <p className="form-help">Use an emoji to represent this category</p>
//                     </div>

//                     <div className="modal-actions">
//                         <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             {editingCategory ? 'Update Category' : 'Add Category'}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>
//         </div>
//     );
// };

// export default MenuCategories;
