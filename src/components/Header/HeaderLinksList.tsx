import { navLinks } from "@/constants/navLinks";
import React from "react";
import HeaderLink from "./HeaderLink";
import initTranslations from "@/app/i18n";

type HeaderLinksListProps = {
  locale: string;
  isAdmin: boolean;
};

async function HeaderLinksList({ locale, isAdmin }: HeaderLinksListProps) {
  const { t } = await initTranslations(locale, ["navbar"]);

  const linksToShow = navLinks.filter(({ translateKey }) => {
  
    if (translateKey === "admin") {
      return isAdmin;
    }
    return true;
  });

  return (
    <nav>
      <ul className="flex gap-6 xl:gap-12">
        {linksToShow.map(({ translateKey }) => (
          <li key={translateKey}>
            <HeaderLink linkName={translateKey}>
              {t(`${translateKey}`)}
            </HeaderLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HeaderLinksList;
