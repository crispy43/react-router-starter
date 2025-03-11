import {
  Links,
  type LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import globalStyles from '~/styles/global.css?url';

import { getLanguageSession, getThemeSession } from './.server/services/session.service';
import type { Route } from './+types/root';
import { LanguageProvider } from './hooks/use-language';
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from './hooks/use-theme';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { getLanguage } = await getLanguageSession(request);
  const { getTheme } = await getThemeSession(request);
  return { lang: getLanguage(), ssrTheme: getTheme() };
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: globalStyles }];
};

export const App = ({ lang, ssrTheme }: Route.ComponentProps['loaderData']) => {
  const [theme] = useTheme();

  return (
    <html lang={lang} className={theme ?? ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(ssrTheme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
  const { lang, ssrTheme } = loaderData;

  return (
    <LanguageProvider specifiedLanguage={lang} languageAction="/api/language">
      <ThemeProvider specifiedTheme={ssrTheme} themeAction="/api/theme">
        <App lang={lang} ssrTheme={ssrTheme} />
      </ThemeProvider>
    </LanguageProvider>
  );
}
