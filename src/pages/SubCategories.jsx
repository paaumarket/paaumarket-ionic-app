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
import { useRouteMatch, generatePath } from "react-router-dom";
import DefaultCategoryImage from "@/assets/category.svg";

export default () => {
  const match = useRouteMatch();

  const {
    isPending,
    isSuccess,
    data: category,
  } = useQuery({
    queryKey: ["category", match.params.category],
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
            <IonBackButton defaultHref="/app/adverts" />
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
                  src={
                    category["image"]?.["cache"]?.["extra-small"] ||
                    DefaultCategoryImage
                  }
                  className="object-cover object-center w-full h-full"
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
  const {
    isPending,
    isSuccess,
    data: subCategories,
  } = useQuery({
    queryKey: ["category", category["slug"], "children", { counts: true }],
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
            <IonItem
              key={sub["id"]}
              routerLink={generatePath(
                "/app/adverts/categories/:category/:sub",
                {
                  category: category["slug"],
                  sub: sub["slug"],
                }
              )}
            >
              <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
                <img
                  alt={sub["name"]}
                  src={
                    sub["image"]?.["cache"]?.["extra-small"] ||
                    DefaultCategoryImage
                  }
                  className="object-cover object-center w-full h-full"
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
