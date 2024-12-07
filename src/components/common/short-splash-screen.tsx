"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShortSplashScreen() {
  const [shouldUnmount, setShouldUnmount] = useState(false);

  useEffect(() => {
    document.body.style.position = "fixed";
    document.body.style.width = "100vw";
    const timeoutId = setTimeout(() => {
      document.body.style.position = "";
      document.body.style.width = "";
      setShouldUnmount(true);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, []);

  return shouldUnmount ? null : (
    <div className="h-screen w-full select-none pointer-events-none fixed overflow-hidden z-[5000]">
      <div className="fixed h-full w-full flex flex-col justify-center items-start translate-x-[-50vw] lg:translate-x-[-35vw] xl:translate-x-[-20vw] z-[6000]">
        {/* Hana 01 */}
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: "150vw", y: "-300px", rotate: 180 }}
          transition={{ duration: 2, delay: 2.5, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_01.png"
            alt="sakura flower petal"
            width={300}
            height={300}
            className="w-[150px] lg:w-[220px] xl:w-[300px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: "100px", rotate: 0 }}
          animate={{ x: "150vw", y: "100px", rotate: 180 }}
          transition={{ duration: 2, delay: 3.6, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_01.png"
            alt="sakura flower petal"
            width={150}
            height={150}
            className="w-[75px] lg:w-[110px] xl:w-[150px] h-auto"
          />
        </motion.div>

        {/* Hana 02 */}
        <motion.div
          initial={{ x: 0, y: "100px", rotate: 0 }}
          animate={{ x: "150vw", y: "0", rotate: 180 }}
          transition={{ duration: 2, delay: 3, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_02.png"
            alt="sakura flower petal"
            width={100}
            height={100}
            className="w-[50px] lg:w-[75px] xl:w-[100px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: "400px", rotate: 0 }}
          animate={{ x: "150vw", y: "100px", rotate: 180 }}
          transition={{ duration: 2, delay: 3, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_02.png"
            alt="sakura flower petal"
            width={180}
            height={180}
            className="w-[90px] lg:w-[135px] xl:w-[180px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: "150vw", y: "-200px", rotate: 180 }}
          transition={{ duration: 2, delay: 3.2, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_02.png"
            alt="sakura flower petal"
            width={200}
            height={200}
            className="w-[100px] lg:w-[150px] xl:w-[200px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: "150vw", y: "-200px", rotate: 180 }}
          transition={{ duration: 2, delay: 2.6, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_02.png"
            alt="sakura flower petal"
            width={100}
            height={100}
            className="w-[50px] lg:w-[75px] xl:w-[100px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: "150vw", y: "-200px", rotate: 180 }}
          transition={{ duration: 2, delay: 3.8, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_02.png"
            alt="sakura flower petal"
            width={100}
            height={100}
            className="w-[50px] lg:w-[75px] xl:w-[100px] h-auto"
          />
        </motion.div>

        {/* Hana 03 */}
        <motion.div
          initial={{ x: 0, y: 0, rotate: 30 }}
          animate={{ x: "150vw", y: "-200px", rotate: 180 }}
          transition={{ duration: 2, delay: 2.8, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_03.png"
            alt="sakura flower petal"
            width={230}
            height={230}
            className="w-[110px] lg:w-[180px] xl:w-[230px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: "150vw", y: "-200px", rotate: 180 }}
          transition={{ duration: 2, delay: 3.5, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_03.png"
            alt="sakura flower petal"
            width={220}
            height={220}
            className="w-[100px] lg:w-[160px] xl:w-[220px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: "100px", rotate: 0 }}
          animate={{ x: "150vw", y: "0", rotate: 180 }}
          transition={{ duration: 2, delay: 4, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_03.png"
            alt="sakura flower petal"
            width={120}
            height={120}
            className="w-[60px] lg:w-[90px] xl:w-[120px] h-auto"
          />
        </motion.div>

        {/* Hana 04 */}
        <motion.div
          initial={{ x: 0, y: "400px", rotate: 0 }}
          animate={{ x: "150vw", y: "100px", rotate: 180 }}
          transition={{ duration: 2, delay: 2.7, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_04.png"
            alt="sakura flower petal"
            width={180}
            height={180}
            className="w-[90px] lg:w-[135px] xl:w-[180px] h-auto"
          />
        </motion.div>
        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: "150vw", y: "-100px", rotate: 180 }}
          transition={{ duration: 2, delay: 3.2, ease: "easeIn" }}
          className="fixed"
        >
          <Image
            src="/hana_04.png"
            alt="sakura flower petal"
            width={200}
            height={200}
            className="w-[100px] lg:w-[150px] xl:w-[200px] h-auto"
          />
        </motion.div>
      </div>
      <motion.div
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 3 }}
        className="font-playfair fixed flex flex-col justify-center items-center h-full w-full text-3xl md:text-5xl gap-5 xl:gap-10 text-center px-4 text-slate-800 z-[5001]"
      >
        <motion.p
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 5, delay: 1 }}
          className="m-0"
        >
          Bảng <strong className="text-red-500">Xếp Hạng</strong> Light Novel{" "}
          <strong className="text-blue-500">Việt Nam</strong>!
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 4.5 }}
        className="w-full h-full bg-white"
      ></motion.div>
    </div>
  );
}
