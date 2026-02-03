import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";
import Dashboard from "./pages/Dashboard";
import OccasionDetail from "./pages/OccasionDetail";
import OccasionReport from "./pages/OccasionReport";
import ServiceDetail from "./pages/ServiceDetail";
import CategoryDetail from "./pages/CategoryDetail";
import PackageDetail from "./pages/PackageDetail";
import Login from "./pages/Login";
import Occasions from "./pages/Occasions";
import Services from "./pages/Services";
import Categories from "./pages/Categories";
import MenuItems from "./pages/MenuItems";
import Starter from "./pages/Starter";
import MainCourse from "./pages/MainCourse";
import Dessert from "./pages/Dessert";
import BreadRice from "./pages/BreadRice";
import Blogs from "./pages/Blogs";
import PopularItems from "./pages/PopularItems";
import RangeMenus from "./pages/RangeMenus";
import Youtube from "./pages/Youtube";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import "./styles/index.css";
import "./App.css";
import GlobalLoader from "./components/common/GlobalLoader";
import ProtectedRoute from "./components/common/ProtectedRoute";

const Layout = () => {
  return (
    <div className="app">
      <GlobalLoader />
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/occasions" element={<Occasions />} />
              <Route path="/occasions/:id" element={<OccasionDetail />} />
              <Route
                path="/occasions/:id/report"
                element={<OccasionReport />}
              />
              <Route path="/packages/:id" element={<PackageDetail />} />

              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:id" element={<CategoryDetail />} />
              <Route path="/menu/starter" element={<Starter />} />
              <Route path="/menu/main-course" element={<MainCourse />} />
              <Route path="/menu/dessert" element={<Dessert />} />
              <Route path="/menu/bread-rice" element={<BreadRice />} />

              <Route path="/menu-items" element={<MenuItems />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/popular-items" element={<PopularItems />} />
              <Route path="/range-menus" element={<RangeMenus />} />
              <Route path="/youtube" element={<Youtube />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
