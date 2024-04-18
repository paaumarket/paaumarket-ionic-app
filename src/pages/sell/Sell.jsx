import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import ListProduct from "./ListProduct";

import product from "../../assets/product.png";
import { Link } from "react-router-dom";
import { personCircleOutline } from "ionicons/icons";

// API DEMO
const products = [
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
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>

          <IonTitle>
            <div className="flex justify-center items-center">
              <div className="grow text-center">Post new advert</div>
              <Link to="/login">
                <IonIcon icon={personCircleOutline} />
              </Link>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  );
}

{
  /* <ListProduct products={products} /> */
}
