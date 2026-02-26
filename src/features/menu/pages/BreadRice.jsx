import { useState } from "react";
import { Search, ClipboardList, Check, X, UtensilsCrossed } from "lucide-react";
import { useData } from "../../../context/DataContext";
import { getThumbnail } from "../../../utils/imageOptimizer";

const BreadRice = () => {
  const { menuItems } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [addedItems, setAddedItems] = useState([]);

  // Filter items for Bread, Rice & Noodles category (category ID = 3)
  const breadRiceItems = menuItems.filter((item) => item.category === 3);

  // Filter by search term
  const filteredItems = breadRiceItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddItem = (item) => {
    // Check if item is already added
    if (!addedItems.find((i) => i.id === item.id)) {
      setAddedItems([...addedItems, item]);
    }
  };

  const handleRemoveItem = (itemId) => {
    setAddedItems(addedItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="p-6 lg:h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-secondary flex items-center">
          <UtensilsCrossed className="inline mr-2 text-primary" size={24} />{" "}
          Rice & Bread Items
        </h2>
        <p className="text-sm text-gray-500">
          Browse and add rice & bread items to your selection
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Panel - Items Table */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <input
              type="text"
              className="w-full max-w-md px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr className="border-b-2 border-gray-100">
                  <th className="px-4 py-3 font-semibold text-secondary w-20">
                    Image
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary">
                    Item Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary w-24">
                    Type
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary w-24">
                    Price
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary w-28 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => {
                  const isAdded = addedItems.find((i) => i.id === item.id);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={getThumbnail(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-secondary">
                        {item.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.type.toLowerCase() === "veg" ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        ₹{item.price}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isAdded ? "bg-success-light text-success cursor-default" : "bg-primary-gradient text-white hover:shadow-md hover:-translate-y-0.5"}`}
                          onClick={() => handleAddItem(item)}
                          disabled={isAdded}
                        >
                          {isAdded ? (
                            <span className="flex items-center justify-center">
                              <Check className="mr-1" size={16} /> Added
                            </span>
                          ) : (
                            "Add"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Search className="mb-3 text-gray-400" size={48} />
                <p className="text-sm">No items found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Added Items */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <h3 className="font-bold text-secondary px-4 py-3 border-b border-gray-200 bg-white shadow-sm z-10 sticky top-0">
            Added Items
          </h3>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {addedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 relative group"
              >
                <button
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 focus:outline-none"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remove item"
                >
                  <X size={16} />
                </button>
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={getThumbnail(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-semibold text-sm text-secondary truncate">
                    {item.name}
                  </h4>
                  <p className="text-primary font-bold text-xs mt-1">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}

            {addedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center text-sm py-10">
                <ClipboardList
                  className="mb-2 text-gray-400 opacity-50"
                  size={48}
                />
                <p>No items added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadRice;
