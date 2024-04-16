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
  IonPage,
  IonRow,
  IonSearchbar,
  IonText,
} from "@ionic/react";

import Header from "../../component/Header";
import ListProduct from "./ListProduct";

import product from "../../assets/product.png";

// API DEMO
const products: any = [
  {
    _id: 1,
    description: "Apple iPhone X 64 GB White",
    price: "35000",
    createdAt: "15th Dec, 2023",
    thumbnail: product,
  },
];

export default function Sell() {
  return (
    <IonPage>
      <Header title="Post Product ad"></Header>

      <IonContent className="ion-padding">
        <IonText className="ion-padding">Find anything in store.</IonText>

        <>
          <ListProduct products={products} />
        </>
      </IonContent>
    </IonPage>
  );
}
