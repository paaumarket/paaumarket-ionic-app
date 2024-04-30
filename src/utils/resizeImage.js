export default function resizeImage(file, maxSize = 768, type = "image/jpeg") {
  return new Promise((res, rej) => {
    const img = new Image();

    img.addEventListener("load", (ev) => {
      URL.revokeObjectURL(ev.target.src);

      let width = ev.target.naturalWidth;
      let height = ev.target.naturalHeight;

      if (width > maxSize || height > maxSize) {
        let ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(ev.target, 0, 0, width, height);
      canvas.toBlob((blob) => {
        res(
          new File(
            [blob],
            `${Date.now()}${type === "image/jpeg" ? ".jpg" : ".png"}`
          )
        );
      }, type);
    });

    img.addEventListener("error", rej);

    img.src = URL.createObjectURL(file);
  });
}
