import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import copy from "copy-to-clipboard";
import useAuth from "@/hooks/useAuth";

import WemaLogo from "@/assets/banks/wema.png";
import MoniepointLogo from "@/assets/banks/moniepoint.png";
import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePaystackPayment } from "react-paystack";
import CurrencyInput from "react-currency-input-field";
import CurrencyIonInput from "@/component/CurrencyIonInput";
import { useMemo } from "react";

const BANKS_LOGO = {
  "035": WemaLogo,
  50515: MoniepointLogo,
};

const TopUp = () => {
  const { user } = useAuth();
  const [segment, setSegment] = useState("online");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile" />
          </IonButtons>
          <IonTitle>Top Up</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(ev) => setSegment(ev.detail.value)}
          >
            {/* Online */}
            <IonSegmentButton value="online">
              <IonLabel>Online</IonLabel>
            </IonSegmentButton>

            {/* Accounts */}
            <IonSegmentButton value="accounts">
              <IonLabel>Accounts</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        {segment === "online" ? <OnlineTopUp /> : null}
        {segment === "accounts" ? <AccountsTopUp /> : null}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>
            Balance:{" "}
            <IonText
              color={
                user["wallet_balance"] <= 100
                  ? "danger"
                  : user["wallet_balance"] < 1000
                  ? "warning"
                  : "success"
              }
            >
              ₦{Intl.NumberFormat().format(user["wallet_balance"])}
            </IonText>
          </IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
const OnlineTopUp = () => {
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const { user } = useAuth();
  const [amount, setAmount] = useState(100);
  const config = useMemo(
    () => ({
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      amount: amount * 100,
      email: user["email"],
    }),
    [user, amount]
  );

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (amount < 100) {
      presentToast({
        message: "Amount can't be less than 100.",
        color: "danger",
        duration: 2000,
      });
    } else {
      initializePayment({
        onSuccess(response) {
          setAmount(100);
          presentToast({
            message: "Successfully funded.",
            color: "success",
            duration: 5000,
          });
          presentAlert({
            header: "Top Up",
            message:
              "Funding was successful. Please wait while your account is credited!",
            buttons: ["OK"],
          });
        },
        onClose() {
          setAmount(100);
          presentToast({
            message: "Funding was cancelled.",
            color: "warning",
            duration: 2000,
          });
        },
      });
    }
  };

  return (
    <>
      <IonList inset>
        <IonItem>
          <CurrencyInput
            customInput={CurrencyIonInput}
            label="Amount"
            labelPlacement="stacked"
            step={1}
            min={100}
            placeholder={0}
            value={amount}
            onValueChange={(value) => setAmount(value)}
          />
        </IonItem>
      </IonList>

      <IonButton onClick={handlePayment} className="ion-margin" expand="block">
        Add Fund
      </IonButton>
    </>
  );
};

const AccountsTopUp = () => {
  const {
    isPending,
    isSuccess,
    data: accounts,
    refetch,
  } = useQuery({
    queryKey: ["my-top-up-accounts"],
    queryFn: ({ signal }) =>
      api
        .get("/my-top-up-accounts", { signal })
        .then((response) => response.data),
  });

  const [toast] = useIonToast();

  const copyAccountNumber = (number) => {
    copy(number);
    toast({
      message: "Account Number Copied - " + number,
      duration: 1000,
      color: "success",
    });
  };

  return isPending ? (
    <div className="ion-text-center ion-padding">
      <IonSpinner />
    </div>
  ) : isSuccess ? (
    accounts.length ? (
      <IonList>
        {accounts.map((account, i) => (
          <IonItem
            key={i}
            button
            onClick={() => copyAccountNumber(account["account_number"])}
          >
            {/* Bank */}
            <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
              <img
                src={BANKS_LOGO[account["bank_code"]]}
                className="object-cover object-center"
              />
            </IonThumbnail>
            <IonLabel>
              <h4>{account["account_name"]}</h4>
              <p>{account["account_number"]}</p>
              <p>{account["bank_name"]}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    ) : (
      <RequestAccounts onSuccess={() => refetch()} />
    )
  ) : null;
};

const RequestAccounts = ({ onSuccess }) => {
  const [presentToast] = useIonToast();
  const mutation = useMutation({
    mutationKey: ["my-top-up-accounts", "request"],
    mutationFn: () =>
      api.post("/my-top-up-accounts/request").then((response) => response.data),
    onSuccess() {
      presentToast({
        message: "Virtual Accounts Requested",
        color: "success",
        duration: 2000,
      });
    },
    onError(error) {
      presentToast({
        message:
          error?.response?.data?.message || "Failed to request accounts...",
        color: "danger",
        duration: 2000,
      });
    },
  });

  const requestAccounts = () => {
    mutation.mutate(null, { onSuccess });
  };

  return (
    <div className="ion-padding">
      <IonButton expand="block" onClick={requestAccounts}>
        {mutation.isPending ? <IonSpinner /> : "Request Accounts"}
      </IonButton>
    </div>
  );
};

export default TopUp;
