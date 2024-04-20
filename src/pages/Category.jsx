import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
} from "@ionic/react";
import Header from "../component/Header";
import { useParams } from "react-router";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Advert, { AdvertPlaceholder } from "@/component/Advert";
import axios from "axios";

export default function Category() {
  const formData = {
    amount: {
      currency: "NGN",
      total: 400,
    },
    country: "NG",
    expireAt: 300,
    // sn: "PE462xxxxxxxx",
    payMethod: "BankCard",
    product: {
      description: "description",
      name: "name",
    },
    reference: "983541354914",
    returnUrl: "https://paaumarket.com.ng/",
    userInfo: {
      userEmail: "mannydev02@gmail.com",
      userId: "abellmanuell",
      userMobile: "09025534431",
      userName: "Abel Emmanuel",
    },
  };

  var publickey = "OPAYPUB17136012626320.1261909782994628";

  const pay = () => {
    axios({
      url: "https://testapi.opaycheckout.com/api/v1/international/cashier/create",
      method: "POST",

      headers: {
        Authorization: "Bearer " + publickey,
        MerchantId: "256624042026721",
      },
      responseType: "json",
      body: formData,
    }).then((res) => {
      const { body } = res;
      console.log(body, res);
    });
  };

  return (
    <IonPage>
      <Header>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/"></IonBackButton>
        </IonButtons>
        <div className="grow">Category Name</div>
      </Header>

      <IonContent className="ion-padding">
        <IonButton onClick={pay}>Pay Now</IonButton>
      </IonContent>
    </IonPage>
  );
}
