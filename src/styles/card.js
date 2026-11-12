
import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;

    --printer-accent:
      var(--primary-color, #03a9f4);

    --printer-surface:
      var(--ha-card-background,
      var(--card-background-color));

    --printer-border:
      var(--divider-color,
      rgba(127,127,127,0.22));

    --printer-muted:
      var(--secondary-text-color);

    --printer-danger:
      var(--error-color, #db4437);

    --printer-warning:
      var(--warning-color, #e0a000);

    color: var(--primary-text-color);
  }

  ha-card {
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
  }

  .printer-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .printer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .printer-name {
    font-size: 1.15rem;
    font-weight: 650;
    letter-spacing: -0.02em;
    overflow-wrap: anywhere;
  }

  .printer-status {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--printer-muted);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--printer-warning);
  }

  .status-dot.online {
    background: var(--success-color, #43a047);
  }

  .job-layout {
    display: grid;
    grid-template-columns: minmax(115px, 34%) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .thumbnail {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 11px;
    border: 1px solid var(--printer-border);
    background: var(--secondary-background-color);
    display: block;
  }

  .thumbnail-placeholder {
    width: 100%;
    aspect-ratio: 4 / 3;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: var(--secondary-background-color);
    border: 1px solid var(--printer-border);
    color: var(--printer-muted);
  }

  .thumbnail-placeholder ha-icon {
    --mdc-icon-size: 42px;
  }

  .job-details {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .job-filename {
    font-size: 0.98rem;
    font-weight: 600;
    overflow-wrap: anywhere;
    line-height: 1.35;
  }

  .progress-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
    font-size: 0.85rem;
  }

  .progress-number {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .progress-track {
    width: 100%;
    height: 9px;
    background: var(--disabled-color,
      rgba(127,127,127,0.2));
    border-radius: 20px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--printer-accent);
    border-radius: inherit;
    transition: width 300ms ease;
  }

  .progress-fill.complete {
    background: var(--success-color, #43a047);
  }

  .job-times {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .time-box {
    padding: 9px 10px;
    border-radius: 9px;
    background: var(--secondary-background-color);
    min-width: 0;
  }

  .time-label {
    font-size: 0.72rem;
    color: var(--printer-muted);
    margin-bottom: 5px;
  }

  .time-value {
    font-size: 0.85rem;
    font-weight: 550;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }

  .main-controls {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .printer-button {
    min-height: 44px;
    border: 1px solid var(--printer-border);
    border-radius: 10px;
    padding: 8px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 0.84rem;
    font-weight: 550;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease,
      opacity 150ms ease;
  }

  .printer-button:hover:not(:disabled) {
    background: var(--input-fill-color,
      var(--secondary-background-color));
    border-color: var(--printer-accent);
  }

  .printer-button:focus-visible {
    outline: 2px solid var(--printer-accent);
    outline-offset: 2px;
  }

  .printer-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .printer-button ha-icon {
    --mdc-icon-size: 19px;
    flex-shrink: 0;
  }

  .printer-button.warning {
    color: var(--printer-warning);
  }

  .printer-button.danger {
    color: var(--printer-danger);
    border-color: var(--printer-danger);
  }

  .printer-button.emergency {
    background: color-mix(
      in srgb,
      var(--printer-danger) 10%,
      transparent
    );
    font-weight: 700;
  }

  .section {
    border-top: 1px solid var(--printer-border);
    padding-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .section-heading {
    font-size: 0.94rem;
    font-weight: 650;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-heading ha-icon {
    --mdc-icon-size: 19px;
    color: var(--printer-muted);
  }

  details.section > summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    user-select: none;
  }

  details.section > summary::-webkit-details-marker {
    display: none;
  }

  .section-chevron {
    color: var(--printer-muted);
    transition: transform 150ms ease;
  }

  details[open] .section-chevron {
    transform: rotate(180deg);
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(125px, 1fr)
    );
    gap: 8px;
  }

  .statistics-grid {
    display: grid;
    grid-template-columns: repeat(
      var(--statistics-columns, 3),
      minmax(0, 1fr)
    );
    gap: 9px;
  }

  .stat-tile {
    border: 1px solid var(--printer-border);
    border-radius: 11px;
    padding: 11px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    color: var(--printer-muted);
    font-size: 0.76rem;
  }

  .stat-header ha-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }

  .stat-label {
    overflow-wrap: anywhere;
  }

  .stat-value {
    font-size: 1.15rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .stat-tile.large {
    grid-column: span 2;
  }

  .stat-tile.full {
    grid-column: 1 / -1;
  }

  .cameras-grid {
    display: grid;
    grid-template-columns: repeat(
      var(--camera-columns, 2),
      minmax(0, 1fr)
    );
    gap: 11px;
  }

  .camera-tile {
    min-width: 0;
    border: 1px solid var(--printer-border);
    border-radius: 11px;
    overflow: hidden;
    background: var(--secondary-background-color);
  }

  .camera-image {
    width: 100%;
    aspect-ratio: var(--camera-ratio, 16 / 9);
    display: block;
    object-fit: cover;
    background: var(--secondary-background-color);
  }

  .camera-caption {
    padding: 9px 10px;
    font-size: 0.8rem;
    font-weight: 550;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .empty-message {
    color: var(--printer-muted);
    font-size: 0.85rem;
  }

  .action-error {
    border-radius: 9px;
    padding: 10px 12px;
    color: var(--printer-danger);
    background: color-mix(
      in srgb,
      var(--printer-danger) 10%,
      transparent
    );
    font-size: 0.85rem;
  }

  /* OFFLINE */

  .offline-view {
    min-height: 265px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    padding: 15px 8px 23px;
  }

  .sleeping-printer {
    width: min(280px, 85%);
    height: auto;
    overflow: visible;
  }

  .sleep-z {
    animation: sleeping 2.4s ease-in-out infinite;
    transform-origin: center;
  }

  .sleep-z:nth-of-type(2) {
    animation-delay: 0.5s;
  }

  .sleep-z:nth-of-type(3) {
    animation-delay: 1s;
  }

  @keyframes sleeping {
    0% {
      opacity: 0;
      transform: translateY(12px) scale(0.8);
    }

    35% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translateY(-24px) scale(1.15);
    }
  }

  .offline-title {
    font-size: 1.03rem;
    font-weight: 650;
  }

  .offline-description {
    color: var(--printer-muted);
    font-size: 0.84rem;
  }

  .job-layout.no-thumbnail {
  grid-template-columns: minmax(0, 1fr);
}
  .compact .printer-card {
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 600px) {
    .job-layout {
      grid-template-columns: minmax(95px, 32%) minmax(0, 1fr);
      gap: 11px;
    }

    .main-controls {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .statistics-grid {
      grid-template-columns: repeat(
        min(var(--statistics-columns, 2), 2),
        minmax(0, 1fr)
      );
    }

    .cameras-grid {
      grid-template-columns: repeat(
        min(var(--camera-columns, 1), 1),
        minmax(0, 1fr)
      );
    }

    .printer-button {
      min-height: 43px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sleep-z,
    .progress-fill {
      animation: none !important;
      transition: none !important;
    }
  }
`;
