/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import NextLink from 'next/link';
import cn from 'classnames';
import {ExternalLink} from 'components/ExternalLink';
import {IconFacebookCircle} from 'components/Icon/IconFacebookCircle';
import {IconTwitter} from 'components/Icon/IconTwitter';
import {IconGitHub} from 'components/Icon/IconGitHub';

export function Footer() {
  const socialLinkClasses = 'hover:text-primary dark:text-primary-dark';
  return (
    <footer className={cn('text-secondary dark:text-secondary-dark')}>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1 justify-items-start mt-3.5">
          <div
            className="text-xs text-left rtl:text-right mt-2 pe-0.5"
            dir="ltr">
            &copy;{new Date().getFullYear()}
          </div>
        </div>
        <div className="flex flex-col">
          <FooterLink href="/learn" isHeader={true}>
            Apprendre Réac
          </FooterLink>
          <FooterLink href="/learn/">Démarrage rapide</FooterLink>
          <FooterLink href="/learn/installation">Installation</FooterLink>
          <FooterLink href="/learn/describing-the-ui">Décrire l’UI</FooterLink>
          <FooterLink href="/learn/adding-interactivity">
            Ajouter de l’interactivité
          </FooterLink>
          <FooterLink href="/learn/managing-state">Gérer l’état</FooterLink>
          <FooterLink href="/learn/escape-hatches">Échappatoires</FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink href="/reference/reac" isHeader={true}>
            Référence de l’API
          </FooterLink>
          <FooterLink href="/reference/reac">API Réac</FooterLink>
          <FooterLink href="/reference/reacjs-mod">API Réac MOD</FooterLink>
        </div>
        <div className="md:col-start-2 xl:col-start-4 flex flex-col">
          <FooterLink href="/community" isHeader={true}>
            Communauté
          </FooterLink>
          <FooterLink href="https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md">
            Code de conduite
          </FooterLink>
          <FooterLink href="/community/team">L’équipe</FooterLink>
          <FooterLink href="/community/docs-contributors">
            Contributeurs aux docs
          </FooterLink>
          <FooterLink href="/community/acknowledgements">
            Remerciements
          </FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink isHeader={true}>Plus</FooterLink>
          <FooterLink href="/blog">Blog</FooterLink>
          <FooterLink href="https://reactnative.dev/">Réac Native</FooterLink>
          <FooterLink href="https://opensource.facebook.com/legal/privacy">
            Politique de confidentialité
          </FooterLink>
          <FooterLink href="https://opensource.fb.com/legal/terms/">
            Mentions légales
          </FooterLink>
          <div className="flex flex-row items-center mt-8 gap-x-2">
            <ExternalLink
              aria-label="Réac sur Facebook"
              href="https://www.facebook.com/react"
              className={socialLinkClasses}>
              <IconFacebookCircle />
            </ExternalLink>
            <ExternalLink
              aria-label="Réac sur Twitter"
              href="https://twitter.com/reactjs"
              className={socialLinkClasses}>
              <IconTwitter />
            </ExternalLink>
            <ExternalLink
              aria-label="Réac sur Github"
              href="https://github.com/facebook/react"
              className={socialLinkClasses}>
              <IconGitHub />
            </ExternalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  isHeader = false,
}: {
  href?: string;
  children: React.ReactNode;
  isHeader?: boolean;
}) {
  const classes = cn('border-b inline-block border-transparent', {
    'text-sm text-primary dark:text-primary-dark': !isHeader,
    'text-md text-secondary dark:text-secondary-dark my-2 font-bold': isHeader,
    'hover:border-gray-10': href,
  });

  if (!href) {
    return <div className={classes}>{children}</div>;
  }

  if (href.startsWith('https://')) {
    return (
      <div>
        <ExternalLink href={href} className={classes}>
          {children}
        </ExternalLink>
      </div>
    );
  }

  return (
    <div>
      <NextLink href={href} className={classes}>
        {children}
      </NextLink>
    </div>
  );
}
