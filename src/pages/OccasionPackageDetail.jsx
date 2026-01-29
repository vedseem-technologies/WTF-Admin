import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import Toggle from '../components/common/Toggle';
import './Occasions.css';
import './MenuItems.css';

const OccasionPackageDetail = () => {
  const { id } = useParams();
  const { packages, menuItems, updatePackage, loadingPackages } = useData();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const pkg = packages.find(p => p._id === id);

  useEffect(() => {
    if (pkg && pkg.selectedItems) {
      const ids = pkg.selectedItems.map(item => typeof item === 'object' ? item._id : item);
      setSelectedItemIds(ids);
    }
  }, [pkg]);

  if (loadingPackages) {
    return <div className="page-container"><div className="loading-state">Loading...</div></div>;
  }

  if (!pkg) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <h3>Package not found</h3>
        </div>
      </div>
    );
  }

  const handleManageItems = () => {
    // Reset selection to current package items
    const currentIds = pkg.selectedItems ? pkg.selectedItems.map(item => typeof item === 'object' ? item._id : item) : [];
    setSelectedItemIds(currentIds);
    setIsManageModalOpen(true);
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItemIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSaveItems = async () => {
    await updatePackage(pkg._id, {
      ...pkg,
      selectedItems: selectedItemIds
    });
    setIsManageModalOpen(false);
  };

  // Calculate populated items for display
  const displayItems = pkg.selectedItems && pkg.selectedItems.length > 0 && typeof pkg.selectedItems[0] === 'object'
    ? pkg.selectedItems
    : [];

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from the package?')) {
      const newIds = selectedItemIds.filter(id => id !== itemId);
      setSelectedItemIds(newIds);
      await updatePackage(pkg._id, {
        ...pkg,
        selectedItems: newIds
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h2 className="page-title-big">📦 {pkg.packageName}</h2>
          <p className="page-description">Manage details and menu items for this package</p>
        </div>
      </div>



      {/* Manage Items Modal */}
      <Modal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Select Menu Items"
      >
 
      </Modal>
    </div>
  );
};

export default OccasionPackageDetail;
