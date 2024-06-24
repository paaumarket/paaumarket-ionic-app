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
            {/* <iframe src="https://player.vimeo.com/video/966064024?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="720" height="800" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="How To Buy on Paau Market"></iframe> */}
              
              <iframe className="w-full aspect-video" width="720" height="800" src="https://player.vimeo.com/video/966064024?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
          
        </IonContent>
      </IonPage>
    );
}
  
