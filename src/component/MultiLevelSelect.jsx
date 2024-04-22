import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNav,
  IonNavLink,
  IonSearchbar,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmark } from "ionicons/icons";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Fragment } from "react";
import { useMemo } from "react";
import { createContext } from "react";

const MultiLevelSelectContext = createContext();

const MultiLevelSelect = ({
  title = "",
  items,
  selectParent = false,
  selected,
  handleCancel,
  handleSelect,
  renderItem,
}) => {
  const navRef = useRef();
  const [search, setSearch] = useState("");

  const handleSearch = (ev) => setSearch(ev.target.value);
  const clearSearch = () => setSearch("");

  useEffect(() => {
    let pages = [];

    let current = items.find((item) => item["id"] === selected);

    if (
      current &&
      items.some((child) => child["parent_id"] === current["id"])
    ) {
      pages.unshift({
        component: (props) => <SelectPage {...props} />,
        componentProps: {
          active: true,
          title: current["name"],
          parentId: current["id"],
        },
      });
    }

    while (current?.["parent_id"]) {
      parent = items.find((item) => item["id"] === current["parent_id"]);

      pages.unshift({
        component: (props) => <SelectPage {...props} />,
        componentProps: {
          title: parent["name"],
          parentId: current["parent_id"],
        },
      });

      current = parent;
    }

    pages.unshift(() => <SelectPage parentId={null} title={title} />);

    navRef.current?.setPages(pages);
  }, [selected, items]);

  return (
    <MultiLevelSelectContext.Provider
      value={{
        items,
        search,
        selected,
        selectParent,
        handleCancel,
        handleSelect,
        handleSearch,
        clearSearch,
        renderItem,
      }}
    >
      <IonNav ref={navRef} />
    </MultiLevelSelectContext.Provider>
  );
};

const SelectPage = ({ active = false, title = "", parentId = null }) => {
  const {
    items,
    selected,
    selectParent,
    search,
    handleSelect,
    handleCancel,
    handleSearch,
    clearSearch,
    renderItem,
  } = useContext(MultiLevelSelectContext);

  const list = useMemo(
    () =>
      items.filter((item) =>
        search
          ? item["name"].toLowerCase().includes(search.toLowerCase())
          : item["parent_id"] === parentId
      ),
    [parentId, items, search]
  );

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {parentId ? (
              <IonBackButton></IonBackButton>
            ) : (
              <IonButton color={"danger"} onClick={handleCancel}>
                Cancel
              </IonButton>
            )}
          </IonButtons>
          <IonTitle color={active ? "primary" : undefined}>{title}</IonTitle>
          {parentId && selectParent ? (
            <IonButtons slot="end">
              <IonButton shape="round" onClick={() => handleSelect(parentId)}>
                Select
              </IonButton>
            </IonButtons>
          ) : null}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={handleSearch}
            onIonCancel={handleCancel}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {list.map((item, i) => (
            <Fragment key={i}>
              {items.some((child) => child["parent_id"] === item["id"]) ? (
                <IonNavLink
                  routerDirection="forward"
                  component={() => (
                    <SelectPage
                      active={selected === item["id"]}
                      title={item["name"]}
                      parentId={item["id"]}
                    />
                  )}
                >
                  {renderItem ? (
                    renderItem({
                      item,
                      active: selected === item["id"],
                      onClick: clearSearch,
                    })
                  ) : (
                    <SelectItem
                      item={item}
                      active={selected === item["id"]}
                      onClick={clearSearch}
                    ></SelectItem>
                  )}
                </IonNavLink>
              ) : renderItem ? (
                renderItem({
                  item,
                  active: selected === item["id"],
                  onClick: () => handleSelect(item["id"]),
                })
              ) : (
                <SelectItem
                  item={item}
                  active={selected === item["id"]}
                  onClick={() => handleSelect(item["id"])}
                ></SelectItem>
              )}
            </Fragment>
          ))}
        </IonList>
      </IonContent>
    </>
  );
};

const SelectItem = ({ item, active, ...props }) => (
  <IonItem {...props}>
    <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
      <img
        alt={item["name"]}
        src={item["image"] ? item["image"]["src"] : null}
      />
    </IonThumbnail>
    <IonLabel>{item["name"]}</IonLabel>
    {active ? <IonIcon icon={checkmark} color="primary" /> : null}
  </IonItem>
);

export default MultiLevelSelect;
