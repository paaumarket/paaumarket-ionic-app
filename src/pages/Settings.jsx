import useApp from "@/hooks/useApp";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";

export default withIonPageQueryRefetch(function Settings() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me"></IonBackButton>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Appearance</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            <IonItem>
              <IonToggle
                checked={darkMode}
                onIonChange={(ev) => toggleDarkMode(ev.detail.checked)}
                justify="space-between"
              >
                Dark Mode
              </IonToggle>
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
});
