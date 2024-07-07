import AdminAdverts from "@/pages/admin/AdminAdverts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminCommand from "@/pages/admin/AdminCommand";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDemands from "@/pages/admin/AdminDemands";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminSubCategories from "@/pages/admin/AdminSubCategories";
import AdminUsers from "@/pages/admin/AdminUsers";
import CategoryAdverts from "@/pages/CategoryAdverts";
import CreateDemand from "@/pages/CreateDemand";
import Demands from "@/pages/Demands";
import EditProfile from "@/pages/EditProfile";
import EditProfileDetails from "@/pages/EditProfileDetails";
import EditProfilePassword from "@/pages/EditProfilePassword";
import EditProfilePhoto from "@/pages/EditProfilePhoto";
import Home from "@/pages/Home";
import MyAdverts from "@/pages/MyAdverts";
import MyDemands from "@/pages/MyDemands";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Sell from "@/pages/sell/Sell";
import Settings from "@/pages/Settings";
import SingleAdvertPage from "@/pages/SingleAdvertPage";
import SubCategories from "@/pages/SubCategories";
import TopUp from "@/pages/TopUp";
import UserAdverts from "@/pages/UserAdverts";
import useAuth from "@/hooks/useAuth";
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
import {
  addCircleOutline,
  homeOutline,
  personCircleOutline,
  telescopeOutline,
} from "ionicons/icons";
import { useMemo } from "react";

import ProtectedRoute from "./ProtectedRoute";

export default function Tabs() {
  const { user } = useAuth();
  const hasNotifications = useMemo(
    () =>
      user?.["unread_notifications_count"] ||
      user?.["admin"]?.["reviewing_adverts_count"] ||
      user?.["admin"]?.["reviewing_demands_count"],
    [user]
  );

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/app" to="/app/adverts" push={false} />

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

        {/* ------------------------ DEMANDS ----------------------- */}
        {/* Demands */}
        <Route
          exact
          path="/app/demands"
          render={() => (
            <ProtectedRoute>
              <Demands />
            </ProtectedRoute>
          )}
        />

        {/* Create Demand */}
        <Route
          exact
          path="/app/demands/new"
          render={() => (
            <ProtectedRoute>
              <CreateDemand />
            </ProtectedRoute>
          )}
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

        {/* Settings */}
        <Route
          exact
          path={"/app/me/settings"}
          render={() => (
            <ProtectedRoute>
              <Settings />
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

        {/* My Demands */}
        <Route
          exact
          path="/app/me/my-demands"
          render={() => (
            <ProtectedRoute>
              <MyDemands />
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

        {/* Admin Notifications */}
        <Route
          exact
          path="/app/me/admin/notifications"
          render={() => (
            <AdminProtectedRoute>
              <AdminNotifications />
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

        {/* Admin Demands */}
        <Route
          exact
          path="/app/me/admin/demands"
          render={() => (
            <AdminProtectedRoute>
              <AdminDemands />
            </AdminProtectedRoute>
          )}
        />

        {/* Admin Command */}
        <Route
          exact
          path="/app/me/admin/command"
          render={() => (
            <AdminProtectedRoute>
              <AdminCommand />
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

        {/* ------------------------ CORE ----------------------- */}
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/adverts" push={false} />}
        />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
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

        {/* Demands */}
        <IonTabButton tab={"demands"} href={"/app/demands"}>
          <IonIcon icon={telescopeOutline} />
          <IonLabel>Demands</IonLabel>
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
