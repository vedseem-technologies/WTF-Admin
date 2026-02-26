import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import { getThumbnail } from "../../../utils/imageOptimizer";
import {
  FileText,
  Printer,
  Salad,
  Utensils,
  UtensilsCrossed,
  Cake,
} from "lucide-react";

const OccasionReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { occasions, getOccasionMenuSelection, menuItems } = useData();
  const occasion = occasions.find((o) => o._id === id);
  const [menu, setMenu] = useState({
    starters: [],
    mainCourses: [],
    desserts: [],
    breadRice: [],
  });

  useEffect(() => {
    const fetchSelection = async () => {
      if (id && menuItems.length > 0) {
        const selection = await getOccasionMenuSelection(id);
        const mapItems = (ids) =>
          ids
            ?.map((itemId) => menuItems.find((i) => i._id === itemId))
            .filter(Boolean) || [];

        setMenu({
          starters: mapItems(selection.starters),
          mainCourses: mapItems(selection.mainCourses),
          desserts: mapItems(selection.desserts),
          breadRice: mapItems(selection.breadRice),
        });
      }
    };
    fetchSelection();
  }, [id, occasion, menuItems]);

  if (!occasion)
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-40 text-gray-500 font-medium">
          Occasion not found
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-secondary flex items-center">
            <FileText className="mr-2 text-primary" size={24} /> Report:{" "}
            {occasion.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Printable menu summary</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-primary-gradient text-white rounded-lg text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Printer className="inline mr-2 -mt-0.5" size={16} /> Print Report
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-xl shadow-sm border border-border p-8 print:p-0 print:border-none print:shadow-none bg-white"
        id="printable-area"
      >
        <div className="flex items-center gap-4 mb-6">
          <img
            src={getThumbnail(occasion.image)}
            alt={occasion.title}
            className="report-logo"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <div>
            <h1 style={{ margin: 0 }}>{occasion.title}</h1>
            <p style={{ margin: "4px 0", color: "gray" }}>
              Menu Selection Report
            </p>
          </div>
        </div>

        <hr className="my-6 border-b border-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
          <ReportSection
            title={
              <span className="flex items-center gap-2">
                <Salad className="text-primary" size={20} /> Starters
              </span>
            }
            items={menu.starters}
          />
          <ReportSection
            title={
              <span className="flex items-center gap-2">
                <Utensils className="text-primary" size={20} /> Main Courses
              </span>
            }
            items={menu.mainCourses}
          />
          <ReportSection
            title={
              <span className="flex items-center gap-2">
                <UtensilsCrossed className="text-primary" size={20} /> Rice &
                Bread
              </span>
            }
            items={menu.breadRice}
          />
          <ReportSection
            title={
              <span className="flex items-center gap-2">
                <Cake className="text-primary" size={20} /> Desserts
              </span>
            }
            items={menu.desserts}
          />
        </div>

        <div className="mt-10 pt-4 border-t border-gray-100 text-sm text-gray-400 text-center">
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <style>{`
                @media print {
                    body { background: white !important; }
                    @page { margin: 20mm; }
                }
            `}</style>
    </div>
  );
};

const ReportSection = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-secondary border-b-2 border-gray-100 pb-2 mb-4">
        {title}
      </h3>
      <ul className="grid grid-cols-2 gap-2 pl-2">
        {items.map((item) => (
          <li key={item._id} className="text-sm text-gray-700 font-medium">
            • {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OccasionReport;
