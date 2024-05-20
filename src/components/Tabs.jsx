import {
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";

import Home from "@/pages/Home";
import SingleAdvertPage from "@/pages/SingleAdvertPage";
import Sell from "@/pages/sell/Sell";
import Profile from "@/pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import SubCategories from "@/pages/SubCategories";
import MyAdverts from "@/pages/MyAdverts";
import TopUp from "@/pages/TopUp";
import CategoryAdverts from "@/pages/CategoryAdverts";
import UserAdverts from "@/pages/UserAdverts";
import useAuth from "@/hooks/useAuth";
import EditProfile from "@/pages/EditProfile";
import EditProfilePhoto from "@/pages/EditProfilePhoto";
import EditProfilePassword from "@/pages/EditProfilePassword";
import EditProfileDetails from "@/pages/EditProfileDetails";
import Notifications from "@/pages/Notifications";
import { useMemo } from "react";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminSubCategories from "@/pages/admin/AdminSubCategories";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

import AdminAdverts from "@/pages/admin/AdminAdverts";
import AdminUsers from "@/pages/admin/AdminUsers";

import {
  addCircleOutline,
  homeOutline,
  personCircleOutline,
} from "ionicons/icons";
import useRouteMatches from "@/hooks/useRouteMatches";
import clsx from "clsx";

import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import Logout from "@/pages/Logout";

import ForgotPassword from "@/pages/ForgotPassword";
import AboutUs from "@/pages/AboutUs";
import SupportLine from "@/pages/SupportLine";

export default function Tabs() {
  const { user } = useAuth();
  const hasNotifications = useMemo(
    () =>
      user?.["unread_notifications_count"] ||
      user?.["admin"]?.["reviewing_adverts_count"],
    [user]
  );

  const showTabBar = !useRouteMatches([
    "/app/login",
    "/app/register",
    "/app/forgot-password",
    "/app/support-line",
    "/app/about-us",
  ]).length;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/app" to="/app/adverts" />

        {/* ------------------------ Adverts ----------------------- */}
        {/* Adverts */}
        <Route exact path="/app/adverts" render={() => <Home />} />

        {/* Advert - Single */}
        <Route
          exact
          path="/app/adverts/ad/:id"
          render={() => <SingleAdvertPage />}
        />

        {/* Advert - Sub Categories */}
        <Route
          exact
          path="/app/adverts/categories/:category"
          render={() => <SubCategories />}
        />
        {/* Advert - Category Ads */}
        <Route
          exact
          path="/app/adverts/categories/:category/:sub"
          render={() => <CategoryAdverts />}
        />

        {/* Adverts  - User Ads */}
        <Route
          exact
          path="/app/adverts/user/:user"
          render={() => <UserAdverts />}
        />

        {/* ------------------------ SELL ----------------------- */}
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

        {/* ------------------------ PROFILE ----------------------- */}
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

        {/* ------------------------ ADMIN ----------------------- */}
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

        {/* Admin Sub Categories */}
        <Route
          exact
          path="/app/me/admin/categories/:category"
          render={() => (
            <AdminProtectedRoute>
              <AdminSubCategories />
            </AdminProtectedRoute>
          )}
        />

        {/* ------------------------ TABLESS PAGES ----------------------- */}
        <Route
          exact
          path="/app/forgot-password"
          render={() => <ForgotPassword />}
        />

        <Route exact path="/app/about-us" render={() => <AboutUs />} />
        <Route exact path="/app/support-line" render={() => <SupportLine />} />

        <Route exact path="/app/register" render={() => <Register />} />
        <Route exact path="/app/login" render={() => <SignIn />} />
        <Route exact path="/app/logout" render={() => <Logout />} />

        {/* ------------------------ CORE ----------------------- */}
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/adverts" />}
        />

        <Route render={() => <Redirect to="/app/adverts" />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className={clsx(!showTabBar ? "hidden" : null)}>
        {/* Home */}
        <IonTabButton tab="adverts" href="/app/adverts">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        {/* Sell */}
        <IonTabButton tab={"sell"} href={"/app/sell"}>
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Sell</IonLabel>
        </IonTabButton>

        {/* Profile */}
        <IonTabButton tab={"profile"} href={"/app/me"}>
          {/* Notifications Count */}
          {hasNotifications ? <IonBadge color={"danger"} /> : null}
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Me</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
