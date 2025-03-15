import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

import { localize } from '~/.server/lib/localization';
import type { WelcomeJson } from '~/.server/locales/types';
import { Theme } from '~/common/constants';
import LogoDark from '~/components/svg/logo-dark.svg?react';
import LogoLight from '~/components/svg/logo-light.svg?react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { useLanguage } from '~/hooks/use-language';
import { useTheme } from '~/hooks/use-theme';

import type { Route } from './+types/home';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const t = await localize<WelcomeJson>(request, 'welcome');
  return { t };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { t } = data;
  return [{ title: t.meta.title }, { name: 'description', content: t.meta.description }];
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { t } = loaderData;
  const [language, setLanguage] = useLanguage();
  const [theme, setTheme] = useTheme();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-muted-foreground/10">
      {theme === Theme.DARK ? (
        <LogoDark className="mb-8 h-auto w-40" />
      ) : (
        <LogoLight className="mb-8 h-auto w-40" />
      )}
      <Card className="flex w-full max-w-sm flex-col">
        <CardHeader>
          <h1 className="text-xl font-bold">{t.welcome}</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-lg text-muted-foreground">{t.word.theme}:</Label>
              <p className="text-lg">{theme}</p>
            </div>
            <Button
              className="w-24"
              onClick={() => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
            >
              {theme === Theme.DARK ? Theme.LIGHT : Theme.DARK}
            </Button>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-lg text-muted-foreground">{t.word.language}:</Label>
              <p className="text-lg">{language}</p>
            </div>
            <Button
              className="w-24"
              onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
            >
              {language === 'en' ? 'ko' : 'en'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
