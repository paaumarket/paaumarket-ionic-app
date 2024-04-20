import AdminDashboard from "@/pages/admin/AdminDashboard";
import { Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminCategoriesAdd from "@/pages/admin/AdminCategoriesAdd";
import AdminSubCategories from "@/pages/admin/AdminSubCategories";

const AdminRouterOutlet = () => {
  return (
    <IonRouterOutlet>
      {/* Dashboard */}
      <Route exact path="/admin">
        <AdminDashboard />
      </Route>

      {/* Categories */}
      <Route exact path="/admin/categories">
        <AdminCategories />
      </Route>
      <Route exact path="/admin/categories/:category">
        <AdminSubCategories />
      </Route>
      <Route exact path="/admin/categories/new">
        <AdminCategoriesAdd />
      </Route>
    </IonRouterOutlet>
  );
};

export default AdminRouterOutlet;
