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
import { useParams } from "react-router";

const product_list = [
  {
    id: "1",
    img_src:
      "https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/V/U/118566_1709127739.jpg",
    name: "Xiaomi Redmi A3 - 6.71 -4gb Ram/ 128gb",
    price: "N116,000.00 ",
  },

  {
    id: "2",
    img_src:
      "https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/C/S/225561_1699955276.jpg",
    price: "N1,532,600.00",
    name: "Apple iPhone 15 Pro 128GB White",
  },
];

export default function SinglePage() {
  const { id } = useParams();

  let singleProduct = product_list.filter((product) => product.id === id);

  return (
    <IonPage>
      <Header></Header>

      <IonContent className="ion-padding">
        <>
          <b>Phone & Tablets</b>
          <IonGrid>
            <IonRow>
              {singleProduct.map((single) => {
                return (
                  <Product
                    key={single.id}
                    source={single.img_src}
                    product_name={single.name}
                    product_price={single.price}
                  />
                );
              })}
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
