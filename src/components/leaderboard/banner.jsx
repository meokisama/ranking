import Image from "next/image";
import "./styles/banner.scss";
import { motion } from "framer-motion";

function Banner() {
  return (
    <div className="ld-banner">
      <div className="bannerimg">
        <Image
          src="/bannerimg.webp"
          alt="bxh light novel banner image"
          width={1820}
          height={956}
        />
      </div>
      <div className="bannertext">
        <motion.h1
          initial={{ opacity: 0, y: "-50px" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 10,
            mass: 0.75,
            stiffness: 300,
            delay: 4.5,
          }}
        >
          <span id="bannertext01">Bảng Xếp Hạng </span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: "-50px" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 10,
            mass: 0.75,
            stiffness: 300,
            delay: 4.7,
          }}
        >
          <span id="bannertext02"> Light Novel</span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: "-50px" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 10,
            mass: 0.75,
            stiffness: 300,
            delay: 4.9,
          }}
        >
          <span id="bannertext03"> Việt Nam</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: "-100px" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            damping: 10,
            mass: 0.75,
            stiffness: 300,
            delay: 5.2,
          }}
          id="extra"
          className="w-fit block mx-auto mb-0 mt-20"
        >
          BẢNG TỔNG SẮP
        </motion.div>
      </div>
    </div>
  );
}

export default Banner;
