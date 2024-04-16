import {
  IonIcon,
  IonLabel,
  IonRouterLink,
  IonSearchbar,
  IonText,
} from "@ionic/react";
import { pencilOutline, trashOutline } from "ionicons/icons";

export default function ListProduct({ products }) {
  let list;
  if (!products.length) {
    list = (
      <tr>
        <td className="inline-block w-full text-center text-gray-400">
          No Sale
        </td>
      </tr>
    );
  } else {
    list = products.map((sale: any, index: any) => {
      return <Product key={sale._id} {...sale} index={index} />;
    });
  }

  return (
    <article className="transition-all sm:block sm:p-10 md:px-20 lg:px-40">
      <IonSearchbar
        showClearButton="focus"
        value=""
        placeholder="Search Paau Market"
      ></IonSearchbar>
      <IonText>
        <h2 className="text-lg font-bold">List Products</h2>
      </IonText>
      <table className="inline-block w-full py-4  sm:w-full">
        <tbody className="grid gap-4">{list}</tbody>
      </table>
    </article>
  );
}

export function Product({ index, description, price, createdAt, thumbnail }) {
  return (
    <tr className="grid max-h-[100px] grid-cols-[auto_100px_1fr] items-center gap-4">
      <td>{index + 1}</td>
      <td>
        <img
          src={thumbnail}
          alt="Product"
          className="max-h-[100px] max-w-[100px] rounded-lg object-cover"
        />
      </td>
      <td>
        <table>
          <tbody>
            <tr className="flex flex-col max-sm:text-sm sm:flex-row sm:space-x-6 lg:space-x-20">
              <td className="font-bold sm:text-sm">{description}</td>
              <td className="text-sm  sm:text-base">
                N{Intl.NumberFormat().format(price)}
              </td>

              <td className="text-sm  sm:text-base">{createdAt}</td>

              <td>
                <IonRouterLink href="#" color="medium" className="ion-padding">
                  <IonIcon icon={pencilOutline} />
                </IonRouterLink>
                <span></span>
                <IonRouterLink href="#" color="danger" className="ion-padding">
                  <IonIcon icon={trashOutline} />
                </IonRouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
