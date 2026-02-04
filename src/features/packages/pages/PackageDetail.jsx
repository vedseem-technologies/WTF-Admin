import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import "../../../components/ui/MultiSelectDropdown.css";
import "../../occasions/pages/Occasions.css";

const PackageDetail = () => {
  const { id } = useParams();
  const {
    packages,
    menuItems,
    getPackageMenuSelection,
    savePackageMenuSelection,
  } = useData();
  const pkg = Array.isArray(packages)
    ? packages.find((p) => p._id === id)
    : null;

  const [selectedStarters, setSelectedStarters] = useState([]);
  const [selectedMainCourse, setSelectedMainCourse] = useState([]);
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const [selectedBreadRice, setSelectedBreadRice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    starter: "",
    mainCourse: "",
    dessert: "",
    breadRice: "",
  });

  // Load saved menu selections for this package
  useEffect(() => {
    const loadSelection = async () => {
      if (id && menuItems.length > 0) {
        setIsLoading(true);
        const savedSelection = await getPackageMenuSelection(id);

        if (savedSelection) {
          // Convert saved IDs to full menu item objects
          // Note: The API might return IDs (if minimal) or objects (if populated).
          // Based on service logic "starters: data.starters || []", these are likely IDs stored in DB.
          // But the GET endpoint "getSelectionByPackageId" might not populate by default unless specified.
          // However main service "packages" populated selectedItems before.
          // Let's assume the new API returns IDs or objects. We should handle both.
          // Currently my backend service returns .lean() without populate on fields other than packageId?
          // Wait, schema "ref: 'MenuItem'". I didn't add .populate() in service "getSelectionByPackageId".
          // So it returns IDs.

          const mapItems = (ids) => {
            if (!ids) return [];
            return menuItems.filter((item) => ids.includes(item._id));
          };

          setSelectedStarters(mapItems(savedSelection.starters));
          setSelectedMainCourse(mapItems(savedSelection.mainCourses));
          setSelectedDesserts(mapItems(savedSelection.desserts));
          setSelectedBreadRice(mapItems(savedSelection.breadRice));
        }
        setIsLoading(false);
      }
    };
    loadSelection();
  }, [id, menuItems]);

  const allMenuItems = menuItems;

  const handleSave = async () => {
    const menuSelection = {
      starters: selectedStarters.map((item) => item._id),
      mainCourses: selectedMainCourse.map((item) => item._id),
      desserts: selectedDesserts.map((item) => item._id),
      breadRice: selectedBreadRice.map((item) => item._id),
    };

    try {
      await savePackageMenuSelection(id, menuSelection);
      alert(`Menu selection saved successfully for ${pkg.packageName}!`);
    } catch (error) {
      alert("Failed to save menu selection.");
    }
  };

  const totalSelected =
    selectedStarters.length +
    selectedMainCourse.length +
    selectedDesserts.length +
    selectedBreadRice.length;

  if (!pkg) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <h3>Package not found</h3>
        </div>
      </div>
    );
  }

  // Reuse MenuDropdown component (local definition or import if extracted)
  // Since it was defined in OccasionDetail locally, I will redefine it here for simplicity
  // or I could have extracted it. Given the constraints, I'll copy-paste the local component logic to ensure it works isolated.
  const MenuDropdown = ({
    label,
    selected,
    setSelected,
    options,
    categoryKey,
    icon,
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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
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
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <div className="ms-wrapper" ref={wrapperRef}>
        <label className="ms-label">
          {icon} {label}
        </label>

        <div
          className="ms-selected-bar"
          onClick={() => setOpenDropdown(isOpen ? null : categoryKey)}
        >
          {selected.length === 0 ? (
            <span className="ms-placeholder">
              Choose {label.toLowerCase()}...
            </span>
          ) : (
            selected.map((item) => (
              <span key={item._id} className="ms-chip">
                {item.name}
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
                onChange={(e) =>
                  setSearchTerms({
                    ...searchTerms,
                    [categoryKey]: e.target.value,
                  })
                }
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
                      <span>{item.name}</span>
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
          <h2 className="page-title-big">📦 {pkg.packageName}</h2>
          <p className="page-description">
            Customize menu for this package (Steps: Occasion → Package → Menu)
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "900px", padding: "2rem" }}>
        <h3 className="page-subtitle" style={{ marginBottom: "24px" }}>
          📋 Package Menu Selection
        </h3>

        {isLoading ? (
          <div>Loading menu selection...</div>
        ) : (
          <>
            <div className="grid-2" style={{ gap: "1.5rem" }}>
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
              <div className="alert alert-info" style={{ marginTop: "24px" }}>
                <strong>Total: {totalSelected} item(s) selected</strong>
                <div
                  style={{
                    fontSize: "0.875rem",
                    marginTop: "8px",
                    color: "var(--info)",
                  }}
                >
                  Starters: {selectedStarters.length} | Main Course:{" "}
                  {selectedMainCourse.length} | Desserts:{" "}
                  {selectedDesserts.length} | Rice & Bread:{" "}
                  {selectedBreadRice.length}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
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
                💾 Save Package Menu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PackageDetail;
