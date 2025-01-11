import AdvertForm from "@/components/AdvertForm";
import useAuth from "@/hooks/useAuth";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { walletOutline } from "ionicons/icons";
import Joyride from "react-joyride";
import { useEffect } from "react";
import { useState } from "react";

export default withIonPageQueryRefetch(function Sell() {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { user, login } = useAuth();
  const [run, setRun] = useState(false);
  const steps = [
    {
      target: ".add-fund",
      content: (
        <p>
          Click the <b>"Add Funds"</b> button to fund your walllet and start
          exploring the exciting possibilities.
        </p>
      ),
      placement: "left-end",
    },
    {
      target: ".select-category",
      content: <p>Select a category for your product and service.</p>,
    },
    {
      target: ".title",
      content: <p>Enter the title or name of your product.</p>,
    },
    {
      target: ".description",
      content: (
        <p>
          <b>[Optional]</b> Enter your product description of what you're
          selling.
        </p>
      ),
    },
    {
      target: ".price",
      content: (
        <p>
          Enter your product price and max 5 images below. <br />
          Thank you.
        </p>
      ),
    },
  ];

  const handleFormSuccess = (data) => {
    queryClient.setQueryData(["advert", data["advert"]["id"]], data["advert"]);

    login({
      user: {
        ...user,
        wallet_balance: data["wallet_balance"],
      },
    });

    history.replace("/app/me/my-adverts");
  };

  useEffect(() => {
    if (!localStorage.getItem("sell-page")) {
      setRun(true);
    }
  }, [run]);

  return (
    <>
      <Joyride
        callback={(state) => {
          if (state.status === "finished" || state.status === "skipped") {
            localStorage.setItem("sell-page", "sell-page");
            setRun(false);
          }
        }}
        steps={steps}
        run={run}
        continuous={true}
        showSkipButton={true}
        hideCloseButton={true}
        locale={{
          last: "Finish",
        }}
        styles={{
          options: {
            padding: 0,
            primaryColor: "#0054e9",
          },
        }}
      />

      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Post New Advert</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonItem>
              <IonIcon
                icon={walletOutline}
                size="large"
                slot="start"
                color={"primary"}
              />

              <IonLabel>
                <h3>
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
                </h3>
                <p>
                  <IonText color="medium">MY BALANCE</IonText>
                </p>
              </IonLabel>

              <IonButton
                slot="end"
                size="small"
                routerLink="/app/me/top-up"
                className="add-fund"
              >
                Add Fund
              </IonButton>
            </IonItem>
          </IonList>
          <IonCard color={"tertiary"}>
            <IonCardContent>
              Please ensure to post in the right category
            </IonCardContent>
          </IonCard>
          <AdvertForm onSuccess={handleFormSuccess} />
        </IonContent>
      </IonPage>
    </>
  );
});
