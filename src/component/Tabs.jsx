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
import { Route } from "react-router-dom";

import Home from "../pages/Home";
import SingleAdvertPage from "../pages/SingleAdvertPage";
import Sell from "../pages/sell/Sell";
import Profile from "@/pages/Profile";
import Category from "@/pages/Category";

export default function Tabs() {
  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home></Home>
          </Route>
          <Route path="/home/:id">
            <SingleAdvertPage></SingleAdvertPage>
          </Route>
          <Route path="/home/post">
            <Sell></Sell>
          </Route>
          <Route path="/home/profile">
            <Profile></Profile>
          </Route>

          <Route path="/home/category">
            <Category></Category>
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/home">
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
    </>
  );
}
