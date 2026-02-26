import { useRef, useEffect } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

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
        if (openDropdown === categoryKey) setOpenDropdown(null);
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

  const removeItem = (itemId) =>
    setSelected(selected.filter((i) => i._id !== itemId));

  const filteredOptions = options.filter((item) =>
    (item.name || item.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block mb-1.5 text-sm font-medium text-secondary">
        {icon} {label}
      </label>

      {/* Selected bar */}
      <div
        className="min-h-[42px] flex flex-wrap items-center gap-1.5 px-3 py-2 border-2 border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all bg-white"
        onClick={() => setOpenDropdown(isOpen ? null : categoryKey)}
      >
        {selected.length === 0 ? (
          <span className="text-sm text-gray-400 flex-1">
            Choose {label.toLowerCase()}...
          </span>
        ) : (
          selected.map((item) => (
            <span
              key={item._id}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
            >
              {item.name || item.title}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item._id);
                }}
                className="text-primary/60 hover:text-primary leading-none"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
        <span className="ml-auto text-gray-400 text-xs">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-[1000] left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border text-gray-400">
            <Search size={16} />
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
              className="flex-1 text-sm outline-none"
              autoFocus
            />
          </div>
          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => {
                const checked = selected.some((i) => i._id === item._id);
                return (
                  <div
                    key={item._id}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm hover:bg-bg-hover transition-all ${checked ? "bg-primary/5 text-primary font-medium" : "text-secondary"}`}
                    onClick={() => toggleItem(item)}
                  >
                    <span>{item.name || item.title}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="accent-primary"
                    />
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-sm text-gray-400 text-center">
                No items found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
