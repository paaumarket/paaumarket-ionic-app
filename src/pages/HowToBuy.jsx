import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemGroup,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonRouterLink,
    IonText,
    IonTitle,
    IonToolbar,
  } from "@ionic/react";
  import {
    callOutline,
    logoFacebook,
    logoTwitter,
    logoWhatsapp,
    mailOutline,
  } from "ionicons/icons";
  
  export default function HowToBuy() {
    return (
      <IonPage>
        <IonHeader className="shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app"></IonBackButton>
            </IonButtons>
            <IonTitle>How To Buy</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="ion-padding" fullscreen>
          <div className="mt-10"></div>
          <IonText>
            <div>
              <h2 className="text-center">
                <b>WATCH NOW: How To Buy.</b>
              </h2>
            </div>
          </IonText>

          <div>
            <video controls className="w-full">

            <source src="https://youtu.be/5Ng6l0-NIts?si=DtZfHOjTlA9nolMu"  />
            </video>
          </div>
        </IonContent>
      </IonPage>
    );
}
  