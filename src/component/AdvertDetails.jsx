import { AdvertImages } from "@/component/Advert";
import {
  IonAvatar,
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
              <IonAvatar className={clsx("w-5 h-5", "inline-block")}>
                <img
                  alt={advert["user_name"]}
                  src={
                    advert["user_profile_photo"]?.["cache"]?.["extra-small"] ||
                    DefaultUserImage
                  }
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>{" "}
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
                src={advert["category_image"]?.["cache"]?.["extra-small"]}
                className="object-cover object-center w-full h-full"
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
        <div className="w-full">
          <AdvertImages advert={advert} />
        </div>
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
