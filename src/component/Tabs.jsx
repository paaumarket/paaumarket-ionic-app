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
// import Category from "@/pages/Category";
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

export default function Tabs() {
  const { user } = useAuth();
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

        {/* Posts */}
        <Route
          exact
          path="/home/post"
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
          path="/home/profile"
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
        <IonTabButton tab="post" href="/home/post">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Sell</IonLabel>
        </IonTabButton>

        {/* Profile */}
        <IonTabButton tab="profile" href="/home/profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profile</IonLabel>
          {/* Pending Adverts Count */}
          {user?.["admin"]?.["reviewing_adverts_count"] ? (
            <IonBadge color={"warning"}>
              {user?.["admin"]?.["reviewing_adverts_count"]}
            </IonBadge>
          ) : null}
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
