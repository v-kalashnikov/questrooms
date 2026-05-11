import Link from "next/link";
import AddressInfoItem from "./_components/AddressInfoItem";
import MapWindow from "./_components/MapWindow";
import { getRandomImagePath } from "@/lib/utils/getRandomImageNames";
import React from "react";

export default async function ContactsPage() {
  const imagePath = getRandomImagePath();

  return (
    <div
      className="bg-scroll h-screen bg-cover bg-center text-textWhite "
      style={{
        backgroundImage: `url(${imagePath})`,
      }}
    >
      <div className="pt-[122px] backdrop-blur-md h-screen">
        <section className="container mx-auto flex flex-col ">
          <span className="text-brandOrange font-medium">квести у Тернополі</span>
          <h2 className="text-6xl text-textWhite font-extrabold mt-1">
            Контакти
          </h2>
          <div className="pt-12 border-t-[0.5px] border-textWhite mt-7 flex items-center pl-[30px] justify-between">
            <div className="flex flex-col gap-9">
              <AddressInfoItem label="Адреса">
                <span>м. Тернопіль=</span>
              </AddressInfoItem>
              <AddressInfoItem label="Режим роботи">
                <span>Щодня з 9 до 22</span>
              </AddressInfoItem>
              <AddressInfoItem label="Телефон">
                <Link
                  href="tel:011-111-11-11"
                  className="font-semibold text-sm text-textWhite"
                >
                  011-111-11-11
                </Link>
              </AddressInfoItem>
              <AddressInfoItem label="Email">
                <Link href="mailto:quest-room@gmail.ua">
                  quest-room@gmail.ua
                </Link>
              </AddressInfoItem>
            </div>
            <MapWindow />
          </div>
        </section>
      </div>
    </div>
  );
}
