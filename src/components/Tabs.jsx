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

import Home from "../pages/Home";
import SingleAdvertPage from "../pages/SingleAdvertPage";
import Sell from "../pages/sell/Sell";
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
        <Redirect exact path="/home" to="/home/adverts" />

        <Route
          exact
          path="/home/adverts/categories/:category"
          render={() => <SubCategories />}
        />

        <Route
          exact
          path="/home/adverts/categories/:category/:sub"
          render={() => <CategoryAdverts />}
        />

        <Route
          exact
          path="/home/adverts/user/:user"
          render={() => <UserAdverts />}
        />

        {/* Adverts */}
        <Route
          exact
          path="/home/adverts/ad/:id"
          render={() => <SingleAdvertPage />}
        />

        <Route exact path="/home/adverts" render={() => <Home />} />

        {/* Sell */}
        <Route
          exact
          path="/home/sell"
          render={() => (
            <ProtectedRoute>
              <Sell />
            </ProtectedRoute>
          )}
        />

        {/* My Adverts */}
        <Route
          exact
          path="/home/profile/my-adverts"
          render={() => (
            <ProtectedRoute>
              <MyAdverts />
            </ProtectedRoute>
          )}
        />

        {/* Edit Profile Password */}
        <Route
          exact
          path="/home/profile/edit/password"
          render={() => (
            <ProtectedRoute>
              <EditProfilePassword />
            </ProtectedRoute>
          )}
        />

        {/* Edit Profile Photo */}
        <Route
          exact
          path="/home/profile/edit/photo"
          render={() => (
            <ProtectedRoute>
              <EditProfilePhoto />
            </ProtectedRoute>
          )}
        />

        {/* Edit Profile Details */}
        <Route
          exact
          path="/home/profile/edit/details"
          render={() => (
            <ProtectedRoute>
              <EditProfileDetails />
            </ProtectedRoute>
          )}
        />

        {/* Edit Profile */}
        <Route
          exact
          path="/home/profile/edit"
          render={() => (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          )}
        />

        {/* Notifications */}
        <Route
          exact
          path="/home/profile/notifications"
          render={() => (
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          )}
        />

        {/* Top up */}
        <Route
          exact
          path="/home/profile/top-up"
          render={() => (
            <ProtectedRoute>
              <TopUp />
            </ProtectedRoute>
          )}
        />

        {/* Profile */}
        <Route
          exact
          path={"/home/profile"}
          render={() => (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )}
        />

        <Route
          exact
          path="/home"
          render={() => <Redirect to="/home/adverts" />}
        />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        {/* Home */}
        <IonTabButton tab="adverts" href="/home/adverts">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        {/* Sell */}
        <IonTabButton tab={"sell"} href={user ? "/home/sell" : "/login"}>
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Sell</IonLabel>
        </IonTabButton>

        {/* Profile */}
        <IonTabButton tab={"profile"} href={user ? "/home/profile" : "/login"}>
          {/* Notifications Count */}
          {hasNotifications ? <IonBadge color={"danger"} /> : null}
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
