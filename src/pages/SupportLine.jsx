import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
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

export default withIonPageQueryRefetch(function SupportLine() {
  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app"></IonBackButton>
          </IonButtons>
          <IonTitle>Support</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <div className="mt-10"></div>
        <IonText>
          <div className="text-center">
            <IonIcon size="large" icon={callOutline}></IonIcon>
            <h2 className="text-center">
              <b>Get in touch with us for more information</b>
            </h2>
          </div>
        </IonText>

        {/* <div className="mt-5">
          <p> </p>
        </div> */}

        <IonList>
          <IonListHeader>
            <IonLabel>Support line case you need help.</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            <IonRouterLink href="tel:+2349025534431">
              <IonItem>
                <IonIcon slot="start" color={"primary"} icon={callOutline} />
                <IonLabel>+234 90 255 344 31</IonLabel>
              </IonItem>
            </IonRouterLink>

            <IonRouterLink href="mailto:support@paaumarket.com.ng">
              <IonItem>
                <IonIcon slot="start" color={"primary"} icon={mailOutline} />
                <IonLabel>support@paaumarket.com.ng</IonLabel>
              </IonItem>
            </IonRouterLink>
          </IonItemGroup>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Social Media</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            <IonRouterLink href="https://wa.me/+2349025534431">
              <IonItem>
                <IonIcon slot="start" color={"primary"} icon={logoWhatsapp} />
                <IonLabel>Text Us on WhatsApp</IonLabel>
              </IonItem>
            </IonRouterLink>

            <IonRouterLink href="https://web.facebook.com/profile.php?id=61559206804023">
              <IonItem>
                <IonIcon slot="start" color={"primary"} icon={logoFacebook} />
                <IonLabel>Follow Us on Facebook</IonLabel>
              </IonItem>
            </IonRouterLink>

            <IonRouterLink href="https://x.com/paaumarket">
              <IonItem>
                <IonIcon slot="start" color={"primary"} icon={logoTwitter} />
                <IonLabel>Follow Us on Twitter</IonLabel>
              </IonItem>
            </IonRouterLink>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
});
