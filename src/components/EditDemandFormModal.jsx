import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import DemandForm from "./DemandForm";

const EditDemandFormModal = ({ demand, onCancelled, onSuccess }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={onCancelled}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Edit Demand</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        <DemandForm demand={demand} onSuccess={onSuccess} />
      </IonContent>
    </IonPage>
  );
};

export default EditDemandFormModal;
