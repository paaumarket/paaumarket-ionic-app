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

import { ProfileUpdater } from "./ProfileUpdater";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

// All parent components
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import Logout from "@/pages/Logout";

import ForgetPassword from "@/pages/ForgetPassword";
import NewPassword from "@/pages/NewPassword";
import OTP from "@/pages/OTP";

import Home from "@/pages/Home";
import SingleAdvertPage from "@/pages/SingleAdvertPage";
import Sell from "@/pages/sell/Sell";
import Profile from "@/pages/Profile";
import SubCategories from "@/pages/SubCategories";
import MyAdverts from "@/pages/MyAdverts";
import TopUp from "@/pages/TopUp";
import CategoryAdverts from "@/pages/CategoryAdverts";
import UserAdverts from "@/pages/UserAdverts";
import EditProfile from "@/pages/EditProfile";
import EditProfilePhoto from "@/pages/EditProfilePhoto";
import EditProfilePassword from "@/pages/EditProfilePassword";
import EditProfileDetails from "@/pages/EditProfileDetails";
import Notifications from "@/pages/Notifications";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminSubCategories from "@/pages/admin/AdminSubCategories";

import AdminAdverts from "@/pages/admin/AdminAdverts";
import AdminUsers from "@/pages/admin/AdminUsers";

setupIonicReact();

const App = () => {
  return (
    <>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route
              exact
              path="/app/adverts/categories/:category"
              render={() => <SubCategories />}
            />

            <Route
              exact
              path="/app/adverts/categories/:category/:sub"
              render={() => <CategoryAdverts />}
            />

            <Route
              exact
              path="/app/adverts/user/:user"
              render={() => <UserAdverts />}
            />

            {/* Adverts */}
            <Route
              exact
              path="/app/adverts/ad/:id"
              render={() => <SingleAdvertPage />}
            />

            <Route exact path="/app/adverts" render={() => <Home />} />

            {/* Sell */}
            <Route
              exact
              path="/app/sell"
              render={() => (
                <ProtectedRoute>
                  <Sell />
                </ProtectedRoute>
              )}
            />

            {/* Admin Users */}
            <Route
              exact
              path="/app/me/admin/users"
              render={() => (
                <AdminProtectedRoute>
                  <AdminUsers />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin User Adverts */}
            <Route
              exact
              path="/app/me/admin/adverts/user/:user"
              render={() => (
                <AdminProtectedRoute>
                  <UserAdverts backButtonHref="/app/me/admin/users" />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin Adverts */}
            <Route
              exact
              path="/app/me/admin/adverts"
              render={() => (
                <AdminProtectedRoute>
                  <AdminAdverts />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin Categories */}
            <Route
              exact
              path="/app/me/admin/categories"
              render={() => (
                <AdminProtectedRoute>
                  <AdminCategories />
                </AdminProtectedRoute>
              )}
            />

            <Route
              exact
              path="/app/me/admin/categories/:category"
              render={() => (
                <AdminProtectedRoute>
                  <AdminSubCategories />
                </AdminProtectedRoute>
              )}
            />

            {/* Admin Dashboard */}
            <Route
              exact
              path="/app/me/admin"
              render={() => (
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              )}
            />

            {/* My Adverts */}
            <Route
              exact
              path="/app/me/my-adverts"
              render={() => (
                <ProtectedRoute>
                  <MyAdverts />
                </ProtectedRoute>
              )}
            />

            {/* Edit Profile Password */}
            <Route
              exact
              path="/app/me/edit/password"
              render={() => (
                <ProtectedRoute>
                  <EditProfilePassword />
                </ProtectedRoute>
              )}
            />

            {/* Edit Profile Photo */}
            <Route
              exact
              path="/app/me/edit/photo"
              render={() => (
                <ProtectedRoute>
                  <EditProfilePhoto />
                </ProtectedRoute>
              )}
            />

            {/* Edit Profile Details */}
            <Route
              exact
              path="/app/me/edit/details"
              render={() => (
                <ProtectedRoute>
                  <EditProfileDetails />
                </ProtectedRoute>
              )}
            />

            {/* Edit Profile */}
            <Route
              exact
              path="/app/me/edit"
              render={() => (
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              )}
            />

            {/* Notifications */}
            <Route
              exact
              path="/app/me/notifications"
              render={() => (
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              )}
            />

            {/* Top up */}
            <Route
              exact
              path="/app/me/top-up"
              render={() => (
                <ProtectedRoute>
                  <TopUp />
                </ProtectedRoute>
              )}
            />

            {/* Profile */}
            <Route
              exact
              path={"/app/me"}
              render={() => (
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              )}
            />

            <Route
              exact
              path="/app"
              render={() => <Redirect to="/app/adverts" />}
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

            <Route exact path="/" render={() => <Redirect to="/app" />} />

            <Route render={() => <Redirect to="/" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
      <ProfileUpdater />
    </>
  );
};

export default App;
