import * as ReactDOMServer from "react-dom/server";
import { PageContext } from "@yext/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

export { render };

const queryClient = new QueryClient();

const render = async (pageContext: PageContext<any>) => {
  const { Page, pageProps } = pageContext;
  const viewHtml = ReactDOMServer.renderToString(
    <I18nextProvider i18n={i18n} defaultNS={"translation"}>
      <QueryClientProvider client={queryClient}>
        <Page {...pageProps} />
      </QueryClientProvider>
    </I18nextProvider>
  );
  return `<!DOCTYPE html>
    <html lang="<!--app-lang-->">
      <head></head>
      <body>
        <div id="reactele">${viewHtml}</div>
      </body>
    </html>`;
};
