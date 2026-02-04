import { useState, useRef, useEffect } from "react";
import "./MultiSelectDropdown.css"; // Ensure this CSS path is correct or styles are included

const MenuDropdown = ({
  label,
  selected,
  setSelected,
  options,
  categoryKey,
  icon,
  searchTerms,
  setSearchTerms,
  openDropdown,
  setOpenDropdown,
}) => {
  const wrapperRef = useRef(null);
  const isOpen = openDropdown === categoryKey;
  const searchTerm = searchTerms[categoryKey] || "";

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
  }, [openDropdown, categoryKey, setOpenDropdown]);

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
    (item.name || item.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
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
              {item.name || item.title}
              <button
                type="button"
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

export default MenuDropdown;
