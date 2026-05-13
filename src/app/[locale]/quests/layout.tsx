import CategoriesList from "./_components/CategoriesList";
import React from "react";
import initTranslations from "@/app/i18n";

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { t } = await initTranslations(locale, ["questsPage"]);
  return (
    <div className="container mx-auto mt-12 pt-[74px] flex flex-col gap-3 ">
      <h2 className="text-6xl text-textWhite font-extrabold mt-1">
        {t("chooseCategoryHeading")}
      </h2>
      <div className="mt-12 mb-16 space-y-10 flex flex-col w-auto h-auto">
        <CategoriesList locale={locale} />
        {children}
      </div>
    </div>
  );
}
