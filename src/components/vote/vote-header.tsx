import React, { useState, useEffect } from "react";
import Image from "next/image";

function VoteHeader() {
  const [imgHeight, setImgHeight] = useState<number>();

  useEffect(() => {
    const handleResize = () => {
      const imgElement = document.getElementById("votebanner");
      if (imgElement) {
        const newImgHeight = imgElement.clientHeight;
        setImgHeight(newImgHeight * 0.65);
      }
    };

    window.addEventListener("resize", handleResize);

    const handleImageLoad = () => {
      const imgElement = document.getElementById("votebanner");
      if (imgElement) {
        const newImgHeight = imgElement.clientHeight;
        setImgHeight(newImgHeight * 0.65);
      }
    };

    const imgElement = document.getElementById("votebanner");
    if (imgElement) {
      imgElement.addEventListener("load", handleImageLoad);
    }

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (imgElement) {
        imgElement.removeEventListener("load", handleImageLoad);
      }
    };
  }, []);
  return (
    <div>
      <Image
        id="votebanner"
        alt="bxh light novel banner image"
        src="/v_mignon.jpg"
        width={1820}
        height={791}
        quality={100}
        className="w-full h-auto absolute z-[-1]"
      />
      <div style={{ height: imgHeight }}></div>
    </div>
  );
}

export default VoteHeader;
