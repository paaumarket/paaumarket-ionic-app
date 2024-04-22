import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from "@ionic/react";

const Advert = ({ advert }) => {
  return (
    <IonCard routerLink={"/home/adverts/ad/" + advert["id"]}>
      {advert["preview_image"] ? (
        <img alt={advert["title"]} src={advert["preview_image"]["src"]} />
      ) : null}

      {advert["images"]
        ? advert["images"].map((advertImage) => (
            <img
              key={advertImage["id"]}
              alt={advert["title"]}
              src={advertImage["image"]["src"]}
            />
          ))
        : null}
      <IonCardHeader>
        <IonCardTitle>{advert["title"]}</IonCardTitle>
        <IonCardSubtitle>{advert.description}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        ₦{Intl.NumberFormat().format(advert["price"])}
      </IonCardContent>
    </IonCard>
  );
};

export const AdvertPlaceholder = () => (
  <IonCard>
    <IonSkeletonText
      animated={true}
      className="ion-no-margin aspect-square max-h-60"
    ></IonSkeletonText>
    <IonCardHeader>
      <IonCardTitle>
        <IonSkeletonText
          animated={true}
          style={{ width: "80%" }}
          className="ion-no-margin"
        ></IonSkeletonText>
      </IonCardTitle>
      <IonCardSubtitle>
        <IonSkeletonText
          animated={true}
          style={{ width: "60%" }}
          className="ion-no-margin"
        ></IonSkeletonText>
      </IonCardSubtitle>
    </IonCardHeader>
  </IonCard>
);

export default Advert;
