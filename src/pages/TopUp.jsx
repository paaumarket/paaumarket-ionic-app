import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";

import useAuth from "@/hooks/useAuth";

import WemaLogo from "@/assets/banks/wema.png";
import MoniepointLogo from "@/assets/banks/moniepoint.png";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { copyOutline } from "ionicons/icons";
import { useRef } from "react";

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
  const acccountNumberRef = useRef(null);
  const toolTipRef = useRef(null);

  // Copy Account Number
  function copyAccount() {
    const copyText = acccountNumberRef.current;
    navigator.clipboard.writeText(copyText.value);

    const tooltip = toolTipRef.current;
    tooltip.innerHTML = "Copied: " + copyText.value;
  }

  function resetAccount() {
    const tooltip = toolTipRef.current;
    tooltip.innerHTML = "Copy to clipboard";
  }

  const {
    isPending,
    isSuccess,
    data: accounts,
  } = useQuery({
    queryKey: ["my-top-up-accounts"],
    queryFn: ({ signal }) =>
      api
        .get("/my-top-up-accounts", { signal })
        .then((response) => response.data),
  });

  return isPending ? (
    <div className="ion-text-center ion-padding">
      <IonSpinner />
    </div>
  ) : isSuccess ? (
    <IonList>
      {accounts.map((account, i) => (
        <IonItem key={i}>
          {/* Bank */}
          <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
            <img
              src={BANKS_LOGO[account["bank_code"]]}
              className="object-cover object-center"
            />
          </IonThumbnail>
          <IonLabel>
            <h4>{account["account_name"]}</h4>
            <input
              id="account_number"
              type="text"
              value={account["account_number"]}
              readOnly
              disabled
              ref={acccountNumberRef}
              className="bg-transparent w-24"
            />
            <br />
            <div className="tooltip">
              <span className="tooltiptext" id="myTooltip" ref={toolTipRef}>
                Copy to clipboard
              </span>
              <IonButton
                size="small"
                onClick={copyAccount}
                onMouseOut={resetAccount}
                color="dark"
              >
                <IonIcon icon={copyOutline}></IonIcon>
              </IonButton>
            </div>
          </IonLabel>
          <IonNote>{account["bank_name"]}</IonNote>
        </IonItem>
      ))}
    </IonList>
  ) : null;
};

export default TopUp;
