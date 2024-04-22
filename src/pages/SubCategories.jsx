import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouteMatch } from "react-router-dom";

export default () => {
  const match = useRouteMatch();

  const queryKey = ["category", match.params.category];

  const {
    isPending,
    isSuccess,
    data: category,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${match.params.category}`, { signal })
        .then((response) => response.data),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/adverts" />
          </IonButtons>

          <IonTitle>
            {isPending ? "Loading..." : category["name"]}
            {isSuccess ? (
              <IonThumbnail
                className={clsx(
                  "[--size:theme(spacing.9)]",
                  "inline-block align-middle",
                  "ion-margin-start"
                )}
              >
                <img
                  alt={category["name"]}
                  src={category["image"] ? category["image"]["src"] : null}
                />
              </IonThumbnail>
            ) : null}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isSuccess ? <SubCategoryList category={category} /> : null}
      </IonContent>
    </IonPage>
  );
};

const SubCategoryList = ({ category }) => {
  const queryKey = ["category", category["slug"], "children", { counts: true }];

  const {
    isPending,
    isSuccess,
    data: subCategories,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${category["slug"]}/children?counts=true`, { signal })
        .then((response) => response.data),
  });

  return (
    <>
      {isPending ? (
        <div className="ion-padding ion-text-center">
          <IonSpinner />
        </div>
      ) : isSuccess ? (
        <IonList>
          {subCategories.map((sub) => (
            <IonItem key={sub["id"]}>
              <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
                <img
                  alt={sub["name"]}
                  src={sub["image"] ? sub["image"]["src"] : null}
                />
              </IonThumbnail>
              <IonLabel>
                <h3>{sub["name"]}</h3>
                <p>{sub["adverts_count"]} ads</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </>
  );
};
