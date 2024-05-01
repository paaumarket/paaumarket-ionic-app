import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import Advert, { AdvertPlaceholder } from "@/components/Advert";
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
    <div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 425: 2, 567: 3, 768: 4, 1200: 5 }}
      >
        <Masonry gutter="10px">
          {isPending
            ? repeatComponent(<AdvertPlaceholder />, 10)
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
