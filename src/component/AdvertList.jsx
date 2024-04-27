import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import Advert, { AdvertPlaceholder } from "@/component/Advert";
import repeatComponent from "@/utils/repeatComponent";
import { useMemo } from "react";

export default function AdvertList({
  isPending = true,
  isSuccess = false,
  data,
}) {
  const adverts = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <div className="p-2">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 425: 2, 576: 3, 768: 4, 992: 5 }}
      >
        <Masonry gutter="10px">
          {isPending
            ? repeatComponent(<AdvertPlaceholder />, 4)
            : isSuccess
            ? adverts.map((advert) => {
                return <Advert key={advert["id"]} advert={advert} />;
              })
            : null}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
