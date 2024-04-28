import useAuth from "@/hooks/useAuth";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";

import DefaultUserImage from "@/assets/user@100.png";
import { useRef } from "react";
import resizeImage from "@/utils/resizeImage";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { serialize } from "object-to-formdata";

const EditProfile = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen className="ion-padding">
        <ProfilePhotoEdit />
      </IonContent>
    </IonPage>
  );
};

const ProfilePhotoEdit = () => {
  const { user, login } = useAuth();
  const imageUploadRef = useRef();

  const [presentToast, dismissToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();

  const profilePhotoMutation = useProfilePhotoMutation({
    onSuccess() {
      presentToast({
        message: "Profile Photo Updated.",
        color: "success",
        duration: 2000,
      });
    },
    onError(error) {
      presentToast({
        message:
          error?.response?.data?.message || "Failed to update profile photo...",
        color: "danger",
        duration: 2000,
      });
    },
  });

  const upload = (file) => {
    presentLoading("Uploading...")
      .then(() =>
        profilePhotoMutation.mutateAsync(
          { photo: file },
          {
            onSuccess(user) {
              login({ user });
            },
          }
        )
      )
      .finally(() => dismissLoading());
  };
  return (
    <div className="flex flex-col items-start gap-4">
      <IonThumbnail slot="start" className="[--size:theme(spacing.20)]">
        <img src={user["profile_photo_preview"]?.["src"] || DefaultUserImage} />
      </IonThumbnail>

      {/* Button to upload photo */}
      <IonButton onClick={() => imageUploadRef.current?.click()}>
        Change Profile Photo
      </IonButton>

      {/* Hidden Input file */}
      <input
        type="file"
        ref={imageUploadRef}
        accept=".jpg, .jpeg, .png, .gif"
        hidden
        onChange={(ev) => {
          resizeImage(ev.target.files[0], 512)
            .then(upload)
            .finally(() => (ev.target.value = ""));
        }}
      />
    </div>
  );
};

const useProfilePhotoMutation = (options) =>
  useMutation({
    ...options,
    mutationKey: ["user", "profile-photo"],
    mutationFn: (data) =>
      api
        .post(
          "/user/photo",
          serialize({
            _method: "put",
            ...data,
          })
        )
        .then((response) => response.data),
  });

export default EditProfile;
