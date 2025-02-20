import React from 'react';
import { Trans } from 'react-i18next';
import { isPrivate } from './form-ip-utils';

// Matches editor links for: Replit, Glitch, CodeSandbox, GitHub. NOT Codespaces, and NOT Gitpod yet
// Once safari allows negative lookbehinds, this can be used:
// |(?<!\.app)\.github\.dev
const editorRegex =
  /repl\.?it(\.com)?\/(@|join\/)|glitch\.com\/edit\/#!|codesandbox\.io\/s\/|github\.com/;
const fCCRegex =
  /codepen\.io\/freecodecamp|freecodecamp\.rocks|github\.com\/freecodecamp|\.freecodecamp\.org/i;
const httpRegex = /^http:/;

function isPathRoot(urlString: string): boolean {
  try {
    return new URL(urlString).pathname !== '/';
  } catch {
    return false;
  }
}

type Validator = (value: string) => React.ReactElement | null;

export const editorValidator: Validator = value =>
  editorRegex.test(value) ? <Trans>validation.editor-url</Trans> : null;

export const fCCValidator: Validator = value =>
  fCCRegex.test(value) ? <Trans>validation.own-work-url</Trans> : null;

export const localhostValidator: Validator = value =>
  isPrivate(value) ? <Trans>validation.publicly-visible-url</Trans> : null;

export const httpValidator: Validator = value =>
  !isPrivate(value) && httpRegex.test(value) ? (
    <Trans>validation.http-url</Trans>
  ) : null;

export const pathValidator: Validator = value =>
  isPathRoot(value) ? <Trans>validation.path-url</Trans> : null;

export const sourceCodeLinkExistsValidator: Validator = value =>
  value ? null : <Trans>validation.source-code-link-required</Trans>;

export const sourceCodeLinkPublicValidator: Validator = value =>
  isPrivate(value) ? <Trans>validation.source-code-link-public</Trans> : null;
export function composeValidators(...validators: Validator[]) {
  return (value: string): ReturnType<Validator> | null =>
    validators.reduce(
      (error: ReturnType<Validator>, validator) => error ?? validator(value),
      null
    );
}
