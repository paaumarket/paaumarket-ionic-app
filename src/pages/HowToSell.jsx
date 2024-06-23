import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";


export default function HowToSell() {
  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app"></IonBackButton>
          </IonButtons>
          <IonTitle>How To Sell</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <div className="mt-10"></div>
        <IonText>
          <div>
            <h2 className="text-center">
              <b>WATCH NOW: How To Sell.</b>
            </h2>
          </div>
        </IonText>

        <div className="flex justify-center">
          <video controls width="400">
            <source src="/how_to_sell.mp4" />
          </video>

          {/* YouTube */}
          {/* <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/I_l4QIR5D8Y?si=Y2IGG1OUbYw-P_xk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}
        </div>
      </IonContent>
    </IonPage>
  );
}
