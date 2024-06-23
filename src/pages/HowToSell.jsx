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
          <iframe src="https://player.vimeo.com/video/966069545?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="1096" height="2560" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="How To Sell on Paau Market"></iframe>

          {/* YouTube */}
          {/* <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/I_l4QIR5D8Y?si=Y2IGG1OUbYw-P_xk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}
        </div>
      </IonContent>
    </IonPage>
  );
}
