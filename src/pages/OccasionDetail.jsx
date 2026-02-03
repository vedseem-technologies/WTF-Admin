import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getThumbnail } from '../utils/imageOptimizer';
import './Occasions.css';

const OccasionDetail = () => {
  const { id } = useParams();
  const { occasions, packages } = useData();
  const occasion = occasions.find(o => o._id === id);

  if (!occasion) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <h3>Occasion not found</h3>
        </div>
      </div>
    );
  }

  const occasionPackages = packages.filter(p => p.occasionId === id);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h2 className="page-title-big">🎉 {occasion.title}</h2>
          <p className="page-description">View packages for {occasion.title}</p>
        </div>
      </div>

      <div className="table-container">
        {occasionPackages.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Package Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>People</th>
              </tr>
            </thead>
            <tbody>
              {occasionPackages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>
                    <div className="item-image">
                      <img
                        src={getThumbnail(pkg.image)}
                        alt={pkg.packageName}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </td>
                  <td className="font-semibold">{pkg.packageName}</td>
                  <td>
                    <span className={`badge badge-${pkg.isVeg ? 'success' : 'danger'}`}>
                      {pkg.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td>₹{pkg.price?.toLocaleString('en-IN')}</td>
                  <td>{pkg.numberOfPeople} people</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No packages available</h3>
            <p>No packages have been created for this occasion yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OccasionDetail;
