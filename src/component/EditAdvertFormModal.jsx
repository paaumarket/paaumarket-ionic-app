import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AdvertForm from "./AdvertForm";

const EditAdvertFormModal = ({ advert, onCancelled, onSuccess }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={onCancelled}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Edit Advert</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        <AdvertForm isEditing advert={advert} onSuccess={onSuccess} />
      </IonContent>
    </IonPage>
  );
};

export default EditAdvertFormModal;
