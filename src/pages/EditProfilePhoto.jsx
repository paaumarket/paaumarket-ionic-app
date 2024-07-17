import useAuth from "@/hooks/useAuth";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";

import DefaultUserImage from "@/assets/user-avatar.svg";
import { useRef } from "react";
import resizeImage from "@/utils/resizeImage";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { serialize } from "object-to-formdata";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

const EditProfilePhoto = withIonPageQueryRefetch(() => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/edit" />
          </IonButtons>
          <IonTitle>Edit Profile Photo</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen className="ion-padding">
        <ProfilePhotoEdit />
      </IonContent>
    </IonPage>
  );
});

/** Profile Photo Edit */
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <IonAvatar slot="start" className="w-24 h-24">
          <img
            src={
              user["profile_photo"]?.["cache"]?.["small"] || DefaultUserImage
            }
            className="object-cover object-center w-full h-full"
          />
        </IonAvatar>
      </div>

      {/* Button to upload photo */}
      <IonButton onClick={() => imageUploadRef.current?.click()}>
        Change Profile Photo
      </IonButton>

      {/* Hidden Input file */}
      <input
        type="file"
        ref={imageUploadRef}
        accept=".jpg, .jpeg, .png, .gif, .webp"
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

export default EditProfilePhoto;
