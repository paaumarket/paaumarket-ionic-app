import "./index.css";

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
import { useEffect } from "react";

import Tabs from "./components/Tabs";
import useApp from "./hooks/useApp";
import { ProfileUpdater } from "./ProfileUpdater";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

setupIonicReact();

const App = () => {
  const { darkMode } = useApp();

  useEffect(() => {
    document.documentElement.classList.toggle("ion-palette-dark", darkMode);
  }, [darkMode]);
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
