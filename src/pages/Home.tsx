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
import { Link } from "react-router-dom";

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
              {product_list.map((product) => {
                return (
                  <Product
                    key={product.id}
                    id={product.id}
                    source={product.img_src}
                    product_name={product.name}
                    product_price={product.price}
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
    <IonCol size="6" size-md="4" size-lg="2">
      <Link to={"/home/" + props.id}>
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
