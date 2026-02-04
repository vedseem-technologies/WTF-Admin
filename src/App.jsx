import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./features/dashboard/pages/Dashboard";
import OccasionReport from "./features/occasions/pages/OccasionReport";
import PackageDetail from "./features/packages/pages/PackageDetail";
import Login from "./features/auth/pages/Login";
import Occasions from "./features/occasions/pages/Occasions";
import Services from "./features/services/pages/Services";
import Categories from "./features/categories/pages/Categories";
import MenuItems from "./features/menu/pages/MenuItems";
import Starter from "./features/menu/pages/Starter";
import MainCourse from "./features/menu/pages/MainCourse";
import Dessert from "./features/menu/pages/Dessert";
import BreadRice from "./features/menu/pages/BreadRice";
import Blogs from "./features/blogs/pages/Blogs";
import PopularItems from "./features/menu/pages/PopularItems";
import RangeMenus from "./features/menu/pages/RangeMenus";
import Youtube from "./features/youtube/pages/Youtube";
import Orders from "./features/orders/pages/Orders";
import OrderDetail from "./features/orders/pages/OrderDetail";
import Testimonials from "./features/testimonials/pages/Testimonials";
import "./styles/index.css";
import "./App.css";
import GlobalLoader from "./components/feedback/GlobalLoader";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

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
              <Route
                path="/occasions/:id/report"
                element={<OccasionReport />}
              />
              <Route path="/packages/:id" element={<PackageDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/menu/starter" element={<Starter />} />
              <Route path="/menu/main-course" element={<MainCourse />} />
              <Route path="/menu/dessert" element={<Dessert />} />
              <Route path="/menu/bread-rice" element={<BreadRice />} />
              <Route path="/menu-items" element={<MenuItems />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/popular-items" element={<PopularItems />} />
              <Route path="/range-menus" element={<RangeMenus />} />
              <Route path="/testimonials" element={<Testimonials />} />
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
