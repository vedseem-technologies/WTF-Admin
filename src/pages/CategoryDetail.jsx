import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import '../components/common/MultiSelectDropdown.css';
import './Occasions.css';

const CategoryDetail = () => {
  const { id } = useParams();
  const { categories, menuItems, getCategoryMenuSelection, saveCategoryMenuSelection } = useData();
  const category = categories.find(c => c._id === id);

  const [selectedStarters, setSelectedStarters] = useState([]);
  const [selectedMainCourse, setSelectedMainCourse] = useState([]);
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const [selectedBreadRice, setSelectedBreadRice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    starter: '',
    mainCourse: '',
    dessert: '',
    breadRice: ''
  });

  // Load saved menu selections for this category
  useEffect(() => {
    if (id && menuItems.length > 0) {
      const savedSelection = getCategoryMenuSelection(id);

      // Convert saved IDs to full menu item objects
      const starterItems = menuItems.filter(item => savedSelection.starters?.includes(item._id));
      const mainCourseItems = menuItems.filter(item => savedSelection.mainCourses?.includes(item._id));
      const dessertItems = menuItems.filter(item => savedSelection.desserts?.includes(item._id));
      const breadRiceItems = menuItems.filter(item => savedSelection.breadRice?.includes(item._id));

      setSelectedStarters(starterItems);
      setSelectedMainCourse(mainCourseItems);
      setSelectedDesserts(dessertItems);
      setSelectedBreadRice(breadRiceItems);
      setIsLoading(false);
    }
  }, [id, menuItems]);

  const allMenuItems = menuItems;

  const handleSave = () => {
    const menuSelection = {
      starters: selectedStarters.map(item => item._id),
      mainCourses: selectedMainCourse.map(item => item._id),
      desserts: selectedDesserts.map(item => item._id),
      breadRice: selectedBreadRice.map(item => item._id)
    };

    saveCategoryMenuSelection(id, menuSelection);
    alert(`Menu items saved successfully for ${category.title}!`);
  };

  const totalSelected = selectedStarters.length + selectedMainCourse.length +
    selectedDesserts.length + selectedBreadRice.length;

  if (!category) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <h3>Category not found</h3>
        </div>
      </div>
    );
  }

  // Reusable dropdown component
  const MenuDropdown = ({
    label,
    selected,
    setSelected,
    options,
    categoryKey,
    icon
  }) => {
    const wrapperRef = useRef(null);
    const isOpen = openDropdown === categoryKey;
    const searchTerm = searchTerms[categoryKey];

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          if (openDropdown === categoryKey) {
            setOpenDropdown(null);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleItem = (item) => {
      if (selected.find((i) => i._id === item._id)) {
        setSelected(selected.filter((i) => i._id !== item._id));
      } else {
        setSelected([...selected, item]);
      }
    };

    const removeItem = (itemId) => {
      setSelected(selected.filter((i) => i._id !== itemId));
    };

    const filteredOptions = options.filter((item) =>
      (item.name || item.title).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="ms-wrapper" ref={wrapperRef}>
        <label className="ms-label">{icon} {label}</label>

        <div
          className="ms-selected-bar"
          onClick={() => setOpenDropdown(isOpen ? null : categoryKey)}
        >
          {selected.length === 0 ? (
            <span className="ms-placeholder">Choose {label.toLowerCase()}...</span>
          ) : (
            selected.map((item) => (
              <span key={item._id} className="ms-chip">
                {item.name || item.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item._id);
                  }}
                >
                  ✕
                </button>
              </span>
            ))
          )}
          <span className="ms-arrow">{isOpen ? "▲" : "▼"}</span>
        </div>

        {isOpen && (
          <div className="ms-dropdown">
            <div className="ms-search">
              <span className="ms-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerms({
                  ...searchTerms,
                  [categoryKey]: e.target.value
                })}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="ms-options-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item) => {
                  const checked = selected.some((i) => i._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="ms-option"
                      onClick={() => toggleItem(item)}
                    >
                      <span>{item.name || item.title}</span>
                      <input type="checkbox" checked={checked} readOnly />
                    </div>
                  );
                })
              ) : (
                <div className="ms-no-results">No items found</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h2 className="page-title-big">📂 {category.title}</h2>
          <p className="page-description">Select menu items for this category</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '900px', padding: '2rem' }}>
        <h3 className="page-subtitle" style={{ marginBottom: '24px' }}>
          📋 Menu Selection
        </h3>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          <MenuDropdown
            label="Starters"
            icon="🥗"
            selected={selectedStarters}
            setSelected={setSelectedStarters}
            options={allMenuItems}
            categoryKey="starter"
          />

          <MenuDropdown
            label="Main Course"
            icon="🍛"
            selected={selectedMainCourse}
            setSelected={setSelectedMainCourse}
            options={allMenuItems}
            categoryKey="mainCourse"
          />

          <MenuDropdown
            label="Desserts"
            icon="🍰"
            selected={selectedDesserts}
            setSelected={setSelectedDesserts}
            options={allMenuItems}
            categoryKey="dessert"
          />

          <MenuDropdown
            label="Rice & Bread"
            icon="🍚"
            selected={selectedBreadRice}
            setSelected={setSelectedBreadRice}
            options={allMenuItems}
            categoryKey="breadRice"
          />
        </div>

        {/* Summary Section */}
        {totalSelected > 0 && (
          <div className="alert alert-info" style={{ marginTop: '24px' }}>
            <strong>Total: {totalSelected} item(s) selected</strong>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', color: 'var(--info)' }}>
              Starters: {selectedStarters.length} |
              Main Course: {selectedMainCourse.length} |
              Desserts: {selectedDesserts.length} |
              Rice & Bread: {selectedBreadRice.length}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSelectedStarters([]);
              setSelectedMainCourse([]);
              setSelectedDesserts([]);
              setSelectedBreadRice([]);
            }}
            disabled={totalSelected === 0}
          >
            Clear All
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={totalSelected === 0}
          >
            💾 Save Menu Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
