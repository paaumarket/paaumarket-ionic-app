import { IonRefresher, IonRefresherContent } from "@ionic/react";

export default function Refresher({ refresh }) {
  return (
    <IonRefresher
      slot="fixed"
      onIonRefresh={(ev) => refresh().finally(() => ev.detail.complete())}
    >
      <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
  );
}
