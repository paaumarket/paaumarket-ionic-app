import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonSearchbar,
  IonText,
} from "@ionic/react";
import Header from "../component/Header";
import { callOutline } from "ionicons/icons";

export default function SinglePage() {
  return (
    <IonPage>
      <Header></Header>

      <IonContent className="ion-padding">
        <>
          <b>Phone & Tablets</b>
          <IonGrid>
            <IonRow>
              <Product
                source="https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/V/U/118566_1709127739.jpg"
                product_name="Xiaomi Redmi A3 - 6.71 -4gb Ram/ 128gb"
                product_price="N116,000.00"
              />
            </IonRow>
          </IonGrid>
        </>
      </IonContent>
    </IonPage>
  );
}

const Product = (props: any) => {
  return (
    <IonCol>
      <IonCard>
        <img alt={props.product_name} src={props.source} />
        <IonCardHeader>
          <IonCardTitle>{props.product_name}</IonCardTitle>
          <IonCardSubtitle>{props.product_price}</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <IonButton routerLink="wa.me/+2349025534431" expand="block">
            <IonIcon icon={callOutline}></IonIcon>{" "}
            <IonLabel>Show Contact</IonLabel>
          </IonButton>
        </IonCardContent>
      </IonCard>
    </IonCol>
  );
};
