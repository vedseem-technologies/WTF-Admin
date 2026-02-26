import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import {
  Package as PackageIcon,
  ClipboardList,
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Salad,
  Utensils,
  Cake,
  UtensilsCrossed,
  Save,
} from "lucide-react";

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
      <div className="p-6">
        <div className="flex justify-center items-center h-40 text-gray-500 font-medium">
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
      <div className="relative" ref={wrapperRef}>
        <label className="block text-sm font-semibold text-secondary mb-2 flex items-center gap-2">
          {icon} {label}
        </label>

        <div
          className="min-h-[46px] p-2 bg-gray-50 border-2 border-border rounded-lg cursor-pointer flex flex-wrap gap-2 items-center hover:border-primary transition-colors"
          onClick={() => setOpenDropdown(isOpen ? null : categoryKey)}
        >
          {selected.length === 0 ? (
            <span className="text-sm text-gray-400 px-2">
              Choose {label.toLowerCase()}...
            </span>
          ) : (
            selected.map((item) => (
              <span
                key={item._id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-secondary shadow-sm group hover:border-danger hover:text-danger hover:bg-red-50 transition-all"
              >
                {item.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item._id);
                  }}
                  className="text-gray-400 group-hover:text-danger focus:outline-none"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          )}
          <span className="ml-auto text-gray-400 text-xs px-2">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
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
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item) => {
                  const checked = selected.some((i) => i._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-soft hover:text-primary cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                      onClick={() => toggleItem(item)}
                    >
                      <span>{item.name}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className="rounded text-primary focus:ring-primary h-4 w-4"
                      />
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  No items found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary flex items-center">
            <PackageIcon className="inline mr-2 -mt-1 text-primary" size={24} />{" "}
            {pkg.packageName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customize menu for this package (Steps: Occasion → Package → Menu)
          </p>
        </div>
      </div>

      <div
        className="bg-white rounded-xl shadow-sm border border-border p-8 mx-auto"
        style={{ maxWidth: "900px" }}
      >
        <h3 className="text-lg font-bold text-secondary border-b-2 border-gray-100 pb-3 mb-6 flex items-center gap-2">
          <ClipboardList className="inline mr-2 text-primary" size={20} />{" "}
          Package Menu Selection
        </h3>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MenuDropdown
                label="Starters"
                icon={<Salad className="inline text-primary mr-1" size={16} />}
                selected={selectedStarters}
                setSelected={setSelectedStarters}
                options={allMenuItems}
                categoryKey="starter"
              />

              <MenuDropdown
                label="Main Course"
                icon={
                  <Utensils className="inline text-primary mr-1" size={16} />
                }
                selected={selectedMainCourse}
                setSelected={setSelectedMainCourse}
                options={allMenuItems}
                categoryKey="mainCourse"
              />

              <MenuDropdown
                label="Desserts"
                icon={<Cake className="inline text-primary mr-1" size={16} />}
                selected={selectedDesserts}
                setSelected={setSelectedDesserts}
                options={allMenuItems}
                categoryKey="dessert"
              />

              <MenuDropdown
                label="Rice & Bread"
                icon={
                  <UtensilsCrossed
                    className="inline text-primary mr-1"
                    size={16}
                  />
                }
                selected={selectedBreadRice}
                setSelected={setSelectedBreadRice}
                options={allMenuItems}
                categoryKey="breadRice"
              />
            </div>

            {/* Summary Section */}
            {totalSelected > 0 && (
              <div className="mt-8 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <strong className="text-sm">
                  Total: {totalSelected} item(s) selected
                </strong>
                <div className="text-xs font-medium text-blue-600 flex flex-wrap gap-2 sm:gap-4">
                  <span>Starters: {selectedStarters.length}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Main Course: {selectedMainCourse.length}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Desserts: {selectedDesserts.length}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Rice & Bread: {selectedBreadRice.length}</span>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end items-center">
              <button
                className="w-full sm:w-auto px-6 py-2 border-2 border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full sm:w-auto px-6 py-2 bg-primary-gradient text-white rounded-lg text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                onClick={handleSave}
                disabled={totalSelected === 0}
              >
                <Save className="inline mr-2 -mt-1" size={18} /> Save Package
                Menu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PackageDetail;
