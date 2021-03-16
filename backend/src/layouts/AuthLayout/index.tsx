import React, { FC } from "react";
import { getLang } from "@/locales";
import { Copyright } from "@/components";
import styles from "./index.less";

export const AuthLayout: FC = props => {
  const { children } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <h1>Qin Video</h1>
        <p className={styles.title}>{getLang("auth.layout.title")}</p>
        {children}
      </div>
      <Copyright />
    </div>
  );
};
