import useAuth from "@/hooks/useAuth";
import {
  IonPage,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from "@ionic/react";
import {
  homeOutline,
  personCircleOutline,
  addCircleOutline,
} from "ionicons/icons";
import { useMemo } from "react";

export default function TabsPage({ children }) {
  const { user } = useAuth();
  const hasNotifications = useMemo(
    () =>
      user?.["unread_notifications_count"] ||
      user?.["admin"]?.["reviewing_adverts_count"],
    [user]
  );

  return (
    <IonPage>
      {children}
      <IonTabBar>
        {/* Home */}
        <IonTabButton tab="adverts" href="/app/adverts">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        {/* Sell */}
        <IonTabButton tab={"sell"} href="/app/sell">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Sell</IonLabel>
        </IonTabButton>

        {/* Profile */}
        <IonTabButton tab={"profile"} href="/app/me">
          {/* Notifications Count */}
          {hasNotifications ? <IonBadge color={"danger"} /> : null}
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Me</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
}
