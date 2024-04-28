import { AdvertImages } from "@/component/Advert";
import {
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import clsx from "clsx";

import DefaultUserImage from "@/assets/user@100.png";

const AdvertDetails = ({ advert }) => {
  return (
    <IonList>
      {advert["user_name"] ? (
        <IonItem>
          <IonLabel>
            <h4>User</h4>
            <p className="flex flex-wrap items-center gap-2">
              <IonThumbnail
                className={clsx("[--size:theme(spacing.5)]", "inline-block")}
              >
                <img
                  alt={advert["user_name"]}
                  src={
                    advert["user_profile_photo"]?.["src"] || DefaultUserImage
                  }
                />
              </IonThumbnail>{" "}
              {advert["user_name"]}
            </p>
          </IonLabel>
        </IonItem>
      ) : null}

      {/* Title */}
      <IonItem>
        <IonLabel>
          <h4>Title</h4>
          <p>{advert["title"]}</p>
        </IonLabel>
      </IonItem>

      {/* Category */}
      <IonItem>
        <IonLabel>
          <h4>Category</h4>
          <p className="flex flex-wrap items-center gap-2">
            <IonThumbnail slot="start" className="[--size:theme(spacing.8)]">
              <img
                alt={advert["category_name"]}
                src={advert["category_image"]?.["src"]}
              />
            </IonThumbnail>{" "}
            {advert["category_name"]}
          </p>
        </IonLabel>
      </IonItem>
      {/* Price */}
      <IonItem>
        <IonLabel>
          <h4>Price</h4>
          <p>₦{Intl.NumberFormat().format(advert["price"])}</p>
        </IonLabel>
      </IonItem>

      {/* Description */}
      <IonItem>
        <IonLabel>
          <h4>Description</h4>
          <p>{advert["description"]}</p>
        </IonLabel>
      </IonItem>

      {/* Images */}
      <IonItem>
        <IonLabel>
          <h4>Images</h4>
          <p>{advert["images"]["length"]}</p>
        </IonLabel>
      </IonItem>

      <IonItem>
        <AdvertImages advert={advert} />
      </IonItem>

      {/* Status */}
      <IonItem>
        <IonLabel>
          <h4>Status</h4>
          <IonText
            color={
              advert["status"] === "approved"
                ? "success"
                : advert["status"] === "declined"
                ? "danger"
                : "warning"
            }
          >
            <p>{advert["status"].toUpperCase()}</p>
          </IonText>
        </IonLabel>
      </IonItem>
    </IonList>
  );
};

export default AdvertDetails;
