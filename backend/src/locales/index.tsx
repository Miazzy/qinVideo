import intlDefault from "react-intl-universal";
import { zh_CN, en_US } from "./lang";

export type LanguageType = "zh_CN" | "en_US";

const languages = {
  zh_CN,
  en_US,
};

export type LanguageKeys = keyof typeof zh_CN;

const getLang = (key: LanguageKeys, addon?: { [key: string]: string | number }) =>
  intlDefault.get(key, addon);

const getHTML = (key: LanguageKeys, addon?: { [key: string]: string | number }) =>
  intlDefault.getHTML(key, addon);

const initLanguage = async (language: LanguageType = "zh_CN"): Promise<void> => {
  const result = languages[language] || {};
  await intlDefault.init({
    currentLocale: language,
    locales: {
      [language]: result,
    },
  });
};

const setLanguage = (language: LanguageType): void => {
  const languagePre: LanguageType = (localStorage.getItem("locale") as LanguageType) || "zh_CN";
  if (languagePre === language) return;
  localStorage.setItem("locale", language);
  window.location.reload();
};

export { initLanguage, setLanguage, getLang, getHTML };
