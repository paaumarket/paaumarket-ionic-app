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
import Header from "../component/Header";
import { callOutline } from "ionicons/icons";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <IonPage>
      <Header></Header>

      <IonContent className="ion-padding">
        <IonText className="ion-padding">Find anything in store.</IonText>

        <IonSearchbar
          showClearButton="focus"
          value=""
          placeholder="Search Paau Market"
        ></IonSearchbar>

        <>
          <b>Phone & Tablets</b>
          <IonGrid>
            <IonRow>
              <Product
                source="https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/V/U/118566_1709127739.jpg"
                product_name="Xiaomi Redmi A3 - 6.71 -4gb Ram/ 128gb"
                product_price="N116,000.00"
              />
              <Product
                source="https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/C/S/225561_1699955276.jpg"
                product_name="Apple iPhone 15 Pro 128GB White"
                product_price="N1,532,600.00"
              />

              <Product
                source="https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/C/S/225561_1699955276.jpg"
                product_name="Apple iPhone 15 Pro 128GB White"
                product_price="N1,532,600.00"
              />

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
    <IonCol size="6" size-md="4" size-lg="2">
      <Link to="/home/1">
        <IonCard>
          <img alt={props.product_name} src={props.source} />
          <IonCardHeader>
            <IonCardTitle>{props.product_name}</IonCardTitle>
            <IonCardSubtitle>{props.product_price}</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      </Link>
    </IonCol>
  );
};
