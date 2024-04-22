import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
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
import Category from "@/pages/Category";
import ProtectedRoute from "./ProtectedRoute";
import SubCategories from "@/pages/SubCategories";

export default function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/home" to="/home/adverts" />

        <Route exact path="/home/adverts/categories/:category">
          <SubCategories />
        </Route>

        <Route exact path="/home/adverts/category">
          <Category></Category>
        </Route>

        {/* Adverts */}
        <Route exact path="/home/adverts/ad/:id">
          <SingleAdvertPage></SingleAdvertPage>
        </Route>

        <Route exact path="/home/adverts">
          <Home></Home>
        </Route>

        {/* Posts */}
        <Route exact path="/home/post">
          <ProtectedRoute>
            <Sell />
          </ProtectedRoute>
        </Route>

        {/* Profile */}
        <Route exact path="/home/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>

        <Route exact path="/home">
          <Redirect to="/home/adverts" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/home/adverts">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/home/post">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Sell</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/home/profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
