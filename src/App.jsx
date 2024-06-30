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
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

import "./index.css";
/* Theme variables */
import "./theme/variables.css";

import AboutUs from "@/pages/AboutUs";
import ForgotPassword from "@/pages/ForgotPassword";
import HowToBuy from "@/pages/HowToBuy";
import HowToSell from "@/pages/HowToSell";
import Logout from "@/pages/Logout";
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import SupportLine from "@/pages/SupportLine";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import Tabs from "./components/Tabs";
import { ProfileUpdater } from "./ProfileUpdater";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// All parent components

setupIonicReact();

const App = () => {
  return (
    <>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/app" render={() => <Tabs />} />

            <Route
              exact
              path="/forgot-password"
              render={() => <ForgotPassword />}
            />

            <Route exact path="/about-us" render={() => <AboutUs />} />
            <Route exact path="/support-line" render={() => <SupportLine />} />
            <Route exact path="/how-to-sell" render={() => <HowToSell />} />
            <Route exact path="/how-to-buy" render={() => <HowToBuy />} />

            <Route exact path="/register" render={() => <Register />} />
            <Route exact path="/login" render={() => <SignIn />} />
            <Route exact path="/logout" render={() => <Logout />} />

            <Route
              exact
              path="/"
              render={() => <Redirect to="/app" push={false} />}
            />

            <Route render={() => <Redirect to="/" push={false} />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
      <ProfileUpdater />
    </>
  );
};

export default App;
