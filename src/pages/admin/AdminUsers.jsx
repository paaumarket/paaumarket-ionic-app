import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useMemo } from "react";
import DefaultUserImage from "@/assets/user@100.png";
import { Link } from "react-router-dom";
import { generatePath } from "react-router";

const AdminUsers = () => {
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();
  const { data, isPending, isSuccess, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      initialPageParam: "",
      queryKey: search ? ["users", "list", search] : ["users", "list"],
      queryFn: ({ signal, pageParam }) =>
        api
          .get(
            `/users?cursor=${pageParam}${
              search ? `&search=${encodeURIComponent(search)}` : ""
            }`,
            { signal }
          )
          .then((response) => response.data),
      getNextPageParam: (lastPage) => lastPage["next_cursor"],
    });

  const users = useMemo(
    () => data?.pages.reduce((current, page) => current.concat(page.data), []),
    [data]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin" />
          </IonButtons>
          <IonTitle>Users</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            debounce={500}
            onIonInput={(ev) => setSearch(ev.target.value)}
            showClearButton="always"
          />
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        {isPending ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
          </div>
        ) : null}
        {isSuccess ? (
          <IonList>
            {users.map((user) => (
              <AdminUserItem key={user["id"]} user={user} />
            ))}
          </IonList>
        ) : null}

        <IonInfiniteScroll
          onIonInfinite={(ev) => fetchNextPage().finally(ev.target.complete())}
        >
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

const AdminUserItem = ({ user }) => {
  return (
    <IonItem key={user["id"]}>
      <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
        <img src={user["profile_photo"]?.["src"] || DefaultUserImage} />
      </IonThumbnail>
      <IonLabel>
        <h4>{user["name"]}</h4>
        <p>{user["email"]}</p>
        <p>
          <Link
            to={generatePath("/home/adverts/user/:id", {
              id: user["id"],
            })}
          >
            {user["adverts_count"]} ads
          </Link>
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default AdminUsers;
