import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { ErrorLayout } from "@/layouts";
import { ConfigProvider } from "@/contexts";
import { Pages } from "@/pages";
import { Language } from "@/layouts";
import { store } from "@/action";

export const App: FC = () => {
  return (
    <ConfigProvider>
      <Language>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <ErrorLayout>
              <Pages />
            </ErrorLayout>
          </BrowserRouter>
        </ReduxProvider>
      </Language>
    </ConfigProvider>
  );
};
