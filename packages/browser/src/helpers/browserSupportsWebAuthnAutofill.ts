import type { PublicKeyCredentialFuture } from '../types/index.ts';
import { browserSupportsWebAuthn } from './browserSupportsWebAuthn.ts';

/**
 * Determine if the browser supports conditional UI, so that WebAuthn credentials can
 * be shown to the user in the browser's typical password autofill popup.
 */
export function browserSupportsWebAuthnAutofill(): Promise<boolean> {
  if (!browserSupportsWebAuthn()) {
    return _browserSupportsWebAuthnAutofillInternals.stubThis(
      new Promise((resolve) => resolve(false)),
    );
  }

  /**
   * I don't like the `as unknown` here but there's a `declare var PublicKeyCredential` in
   * TS' DOM lib that's making it difficult for me to just go `as PublicKeyCredentialFuture` as I
   * want. I think I'm fine with this for now since it's _supposed_ to be temporary, until TS types
   * have a chance to catch up.
   */
  const globalPublicKeyCredential = globalThis
    .PublicKeyCredential as unknown as PublicKeyCredentialFuture;

  if (globalPublicKeyCredential?.isConditionalMediationAvailable === undefined) {
    return _browserSupportsWebAuthnAutofillInternals.stubThis(
      new Promise((resolve) => resolve(false)),
    );
  }

  return _browserSupportsWebAuthnAutofillInternals.stubThis(
    globalPublicKeyCredential.isConditionalMediationAvailable(),
  );
}

// Make it possible to stub the return value during testing
export const _browserSupportsWebAuthnAutofillInternals = {
  stubThis: (value: Promise<boolean>) => value,
};
