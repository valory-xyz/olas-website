// To track download of EA version of Pearl
export const getPlausibleDownloadEaPearlClass = (platform) =>
  `plausible-event-name=Download+EA+Pearl plausible-event-platform=${platform}`;

// To track update of EA version of Pearl
export const getPlausibleUpdateEaPearlClass = (platform) =>
  `plausible-event-name=Update+EA+Pearl plausible-event-platform=${platform}`;

// To track download of GA version of Pearl
export const getPlausibleDownloadPearlClass = (platform) =>
  `plausible-event-name=Download+Pearl plausible-event-platform=${platform}`;

// To track update of GA version of Pearl
export const getPlausibleUpdatePearlClass = (platform) =>
  `plausible-event-name=Update+Pearl plausible-event-platform=${platform}`;
