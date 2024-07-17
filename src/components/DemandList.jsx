import DefaultUserImage from "@/assets/user-avatar.svg";
import repeatComponent from "@/utils/repeatComponent";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSkeletonText,
} from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import { formatDate } from "date-fns";
import { useMemo } from "react";

export default function DemandList({
  isPending = true,
  isSuccess = false,
  data,
}) {
  const demands = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <IonList>
      {isPending ? (
        repeatComponent(<DemandPlaceholder />, 10)
      ) : isSuccess ? (
        demands.length ? (
          demands.map((demand) => {
            return <Demand key={demand["id"]} demand={demand} />;
          })
        ) : (
          <IonCard color={"tertiary"} className="ion-no-margin">
            <IonCardContent>No demand to show</IonCardContent>
          </IonCard>
        )
      ) : null}
    </IonList>
  );
}

const Demand = ({ demand }) => {
  return (
    <IonItem
      routerLink={`/app/demands/${demand["id"]}`}
      className="ion-align-items-start"
    >
      <IonAvatar className="w-9 h-9" slot="start">
        <img
          src={
            demand["user_profile_photo"]?.["cache"]?.["extra-small"] ||
            DefaultUserImage
          }
          className="object-cover object-center w-full h-full"
        />
      </IonAvatar>

      <IonLabel>
        <h3 style={{ fontWeight: "bold" }}>{demand["title"]}</h3>
        <p>{demand["description"] || "(No description)"}</p>
        <p>
          <IonNote color={"tertiary"}>{demand["user_name"]}</IonNote>
        </p>
        <p>
          <IonNote className="text-xs" color={"tertiary"}>
            <IonIcon icon={eyeOutline} /> {demand["views_count"]}
          </IonNote>{" "}
          -{" "}
          <IonNote className="text-xs">
            {formatDate(demand["created_at"], "PPp")}
          </IonNote>{" "}
        </p>
      </IonLabel>
    </IonItem>
  );
};

export const DemandPlaceholder = () => {
  return (
    <IonItem className="[--padding-start:8px]">
      <IonAvatar className="w-9 h-9" slot="start">
        <IonSkeletonText animated={true}></IonSkeletonText>
      </IonAvatar>
      <IonLabel>
        <IonSkeletonText
          animated={true}
          style={{ width: "20%" }}
        ></IonSkeletonText>
        <IonSkeletonText
          animated={true}
          style={{ width: "80%" }}
        ></IonSkeletonText>
        <IonSkeletonText
          animated={true}
          style={{ width: "50%" }}
        ></IonSkeletonText>
      </IonLabel>
    </IonItem>
  );
};
