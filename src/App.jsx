/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

// All parent components
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Tabs from "./component/Tabs";
import Logout from "./pages/Logout";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminSubCategories from "@/pages/admin/AdminSubCategories";
import AdminProtectedRoute from "./component/AdminProtectedRoute";

import ForgetPassword from "./pages/ForgetPassword";
import NewPassword from "./pages/NewPassword";
import OTP from "./pages/OTP";
import AdminAdverts from "./pages/admin/AdminAdverts";
import MyAds from "./pages/MyAds";

setupIonicReact();

const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Admin Adverts */}
          <Route exact path="/admin/adverts">
            <AdminProtectedRoute>
              <AdminAdverts />
            </AdminProtectedRoute>
          </Route>

          {/* Admin Categories */}
          <Route exact path="/admin/categories">
            <AdminProtectedRoute>
              <AdminCategories />
            </AdminProtectedRoute>
          </Route>
          <Route exact path="/admin/categories/:category">
            <AdminProtectedRoute>
              <AdminSubCategories />
            </AdminProtectedRoute>
          </Route>

          {/* Admin Dashboard */}
          <Route exact path="/admin">
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          </Route>

          <Route path="/home">
            <Tabs />
          </Route>

          <Route path="/forget_password">
            <ForgetPassword />
          </Route>

          <Route path="/new_password">
            <NewPassword />
          </Route>

          <Route path="/otp_verification">
            <OTP />
          </Route>

          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login" component={SignIn} />
          <Route exact path="/logout" component={Logout} />

          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
