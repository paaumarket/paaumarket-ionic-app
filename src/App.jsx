import "./index.css";
import "@/pages/utils.css";

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

// All parent components
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import Tabs from "@/components/Tabs";
import Logout from "@/pages/Logout";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminSubCategories from "@/pages/admin/AdminSubCategories";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

import ForgetPassword from "@/pages/ForgetPassword";
import NewPassword from "@/pages/NewPassword";
import OTP from "@/pages/OTP";
import AdminAdverts from "@/pages/admin/AdminAdverts";
import { ProfileUpdater } from "./ProfileUpdater";
import AdminUsers from "@/pages/admin/AdminUsers";
import UserAdverts from "@/pages/UserAdverts";

setupIonicReact();

const App = () => {
  return (
    <>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            {/* Admin Users */}
            <Route
              exact
              path="/admin/users"
              render={() => (
                <AdminProtectedRoute>
                  <AdminUsers />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin User Adverts */}
            <Route
              exact
              path="/admin/adverts/user/:user"
              render={() => (
                <AdminProtectedRoute>
                  <UserAdverts backButtonHref="/admin/users" />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin Adverts */}
            <Route
              exact
              path="/admin/adverts"
              render={() => (
                <AdminProtectedRoute>
                  <AdminAdverts />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin Categories */}
            <Route
              exact
              path="/admin/categories"
              render={() => (
                <AdminProtectedRoute>
                  <AdminCategories />
                </AdminProtectedRoute>
              )}
            />

            <Route
              exact
              path="/admin/categories/:category"
              render={() => (
                <AdminProtectedRoute>
                  <AdminSubCategories />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin Dashboard */}
            <Route
              exact
              path="/admin"
              render={() => (
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              )}
            />

            <Route
              exact
              path="/forget_password"
              render={() => <ForgetPassword />}
            />
            <Route exact path="/new_password" render={() => <NewPassword />} />
            <Route exact path="/otp_verification" render={() => <OTP />} />

            <Route exact path="/register" render={() => <Register />} />
            <Route exact path="/login" render={() => <SignIn />} />
            <Route exact path="/logout" render={() => <Logout />} />

            <Route path="/home" render={() => <Tabs />} />

            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
      <ProfileUpdater />
    </>
  );
};

export default App;
