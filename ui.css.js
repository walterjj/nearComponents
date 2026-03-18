import { css } from 'lit-element';

export const nearPicoTokens = css`
  :host {
    --near-font-family: var(--pico-font-family, system-ui, sans-serif);
    --near-font-size: var(--pico-font-size, 1rem);
    --near-line-height: var(--pico-line-height, 1.5);
    --near-color: var(--pico-color, #24333e);
    --near-muted-color: var(--pico-muted-color, #5d6b76);
    --near-background-color: var(--pico-background-color, #fff);
    --near-surface-color: var(--pico-card-background-color, var(--near-background-color));
    --near-primary: var(--pico-primary, #0172ad);
    --near-primary-hover: var(--pico-primary-hover, #015887);
    --near-primary-background: var(--pico-primary-background, var(--near-primary));
    --near-primary-inverse: var(--pico-primary-inverse, #fff);
    --near-primary-soft: var(--pico-primary-soft-background, rgba(1, 114, 173, 0.12));
    --near-border-color: var(--pico-border-color, var(--pico-form-element-border-color, #cfd8e1));
    --near-border-radius: var(--pico-border-radius, 0.5rem);
    --near-spacing: var(--pico-spacing, 1rem);
    --near-box-shadow: var(
      --pico-card-box-shadow,
      0 1rem 2rem -1rem rgba(17, 25, 40, 0.35)
    );
    color: var(--near-color);
    font-family: var(--near-font-family);
    font-size: var(--near-font-size);
    line-height: var(--near-line-height);
  }
`;

export const nearControlStyles = css`
  button,
  .near-button,
  a.near-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.5rem;
    padding: 0.625rem 1rem;
    border: 1px solid var(--near-border-color);
    border-radius: var(--near-border-radius);
    background: var(--near-surface-color);
    color: var(--near-color);
    cursor: pointer;
    font: inherit;
    line-height: 1.1;
    text-decoration: none;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      color 120ms ease,
      box-shadow 120ms ease,
      transform 120ms ease;
  }

  button:hover,
  .near-button:hover,
  a.near-button:hover {
    border-color: var(--near-primary);
    color: var(--near-primary);
  }

  button:focus-visible,
  .near-button:focus-visible,
  a.near-button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--near-primary);
    outline-offset: 2px;
  }

  button[disabled],
  .near-button[aria-disabled='true'],
  input[disabled],
  textarea[disabled],
  select[disabled] {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .near-button[data-variant='primary'],
  button[data-variant='primary'] {
    border-color: var(--near-primary-background);
    background: var(--near-primary-background);
    color: var(--near-primary-inverse);
  }

  .near-button[data-variant='primary']:hover,
  button[data-variant='primary']:hover {
    border-color: var(--near-primary-hover);
    background: var(--near-primary-hover);
    color: var(--near-primary-inverse);
  }

  .near-icon-button,
  button.near-icon-button {
    min-width: 2.5rem;
    padding-inline: 0.625rem;
  }

  input,
  textarea,
  select {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid var(--near-border-color);
    border-radius: var(--near-border-radius);
    background: var(--near-background-color);
    color: inherit;
    font: inherit;
    padding: 0.75rem 0.875rem;
  }

  textarea {
    min-height: 6rem;
    resize: vertical;
  }
`;

export const nearMenuSurfaceStyles = css`
  .near-menu-panel {
    min-width: min(18rem, 80vw);
    border: 1px solid var(--near-border-color);
    border-radius: var(--near-border-radius);
    background: var(--near-surface-color);
    box-shadow: var(--near-box-shadow);
    overflow: hidden;
  }

  .near-menu-list {
    display: flex;
    flex-direction: column;
    padding: 0.375rem;
    gap: 0.125rem;
  }

  .near-menu-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.625rem 0.75rem;
    border: 0;
    border-radius: calc(var(--near-border-radius) - 0.125rem);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
    text-decoration: none;
  }

  .near-menu-item:hover,
  .near-menu-item:focus-visible {
    background: var(--near-primary-soft);
    color: var(--near-primary);
    outline: none;
  }
`;
