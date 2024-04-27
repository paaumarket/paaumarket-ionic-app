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
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import copy from "copy-to-clipboard";
import useAuth from "@/hooks/useAuth";

import WemaLogo from "@/assets/banks/wema.png";
import MoniepointLogo from "@/assets/banks/moniepoint.png";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BANKS_LOGO = {
  "035": WemaLogo,
  50515: MoniepointLogo,
};

const TopUp = () => {
  const { user } = useAuth();
  const [segment, setSegment] = useState("accounts");

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
            {/* Accounts */}
            <IonSegmentButton value="accounts">
              <IonLabel>Accounts</IonLabel>
            </IonSegmentButton>

            {/* Manual */}
            <IonSegmentButton value="manual">
              <IonLabel>Manual</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        {segment === "accounts" ? <AccountsTopUp /> : null}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>Balance: ₦{user["wallet_balance"]}</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

const AccountsTopUp = () => {
  const queryClient = useQueryClient();
  const queryKey = ["my-top-up-accounts"];
  const {
    isPending,
    isSuccess,
    data: accounts,
  } = useQuery({
    queryKey,
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
      <RequestAccounts onSuccess={() => queryClient.refetchQueries(queryKey)} />
    )
  ) : null;
};

const RequestAccounts = ({ onSuccess }) => {
  const mutation = useMutation({
    mutationKey: ["my-top-up-accounts", "request"],
    mutationFn: () =>
      api.post("/my-top-up-accounts/request").then((response) => response.data),
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
