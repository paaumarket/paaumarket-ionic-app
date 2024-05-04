import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonBadge,
} from "@ionic/react";
import {
  homeOutline,
  personCircleOutline,
  addCircleOutline,
} from "ionicons/icons";
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

export default function Tabs() {
  const { user } = useAuth();
  const hasNotifications = useMemo(
    () =>
      user?.["unread_notifications_count"] ||
      user?.["admin"]?.["reviewing_adverts_count"],
    [user]
  );
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/app" to="/app/adverts" />

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

        <Route render={() => <Redirect to="/" />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        {/* Home */}
        <IonTabButton tab="adverts" href="/app/adverts">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        {/* Sell */}
        <IonTabButton tab={"sell"} href={user ? "/app/sell" : "/login"}>
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Sell</IonLabel>
        </IonTabButton>

        {/* Profile */}
        <IonTabButton tab={"profile"} href={user ? "/app/me" : "/login"}>
          {/* Notifications Count */}
          {hasNotifications ? <IonBadge color={"danger"} /> : null}
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Me</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
