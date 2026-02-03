import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getThumbnail } from '../utils/imageOptimizer';
import './Occasions.css';

const OccasionReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { occasions, getOccasionMenuSelection, menuItems } = useData();
  const occasion = occasions.find(o => o._id === id);
  const [menu, setMenu] = useState({
    starters: [],
    mainCourses: [],
    desserts: [],
    breadRice: []
  });

  useEffect(() => {
    if (id && menuItems.length > 0) {
      const selection = getOccasionMenuSelection(id);
      const mapItems = (ids) => ids?.map(itemId => menuItems.find(i => i._id === itemId)).filter(Boolean) || [];

      setMenu({
        starters: mapItems(selection.starters),
        mainCourses: mapItems(selection.mainCourses),
        desserts: mapItems(selection.desserts),
        breadRice: mapItems(selection.breadRice)
      });
    }
  }, [id, occasion, menuItems, getOccasionMenuSelection]);

  if (!occasion) return <div className="page-container"><div className="loading-state">Occasion not found</div></div>;

  return (
    <div className="page-container report-page">
      <div className="page-header no-print">
        <div className="page-header-content">
          <h2 className="page-title-big">📄 Report: {occasion.title}</h2>
          <p className="page-description">Printable menu summary</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="btn btn-outline">Back</button>
          <button onClick={() => window.print()} className="btn btn-primary">🖨️ Print Report</button>
        </div>
      </div>

      <div className="card report-content" id="printable-area">
        <div className="report-header-print">
          <img src={getThumbnail(occasion.image)} alt={occasion.title} className="report-logo" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <h1 style={{ margin: 0 }}>{occasion.title}</h1>
            <p style={{ margin: '4px 0', color: 'gray' }}>Menu Selection Report</p>
          </div>
        </div>

        <hr style={{ margin: '20px 0', opacity: 0.2 }} />

        <div className="report-sections">
          <ReportSection title="🥗 Starters" items={menu.starters} />
          <ReportSection title="🍛 Main Courses" items={menu.mainCourses} />
          <ReportSection title="🍚 Rice & Bread" items={menu.breadRice} />
          <ReportSection title="🍰 Desserts" items={menu.desserts} />
        </div>

        <div className="report-footer">
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .page-container { padding: 0 !important; }
                    .card { box-shadow: none !important; border: none !important; padding: 0 !important; }
                    body { background: white !important; }
                }
            `}</style>
    </div>
  );
};

const ReportSection = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="report-section" style={{ marginBottom: '24px' }}>
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>{title}</h3>
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', paddingLeft: '20px' }}>
        {items.map(item => (
          <li key={item._id} style={{ marginBottom: '4px' }}>
            <strong>{item.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OccasionReport;
