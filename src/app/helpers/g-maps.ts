export const openLink = (uri: string): void => {
  window.open(`https://www.google.com/maps/search/?api=1&query=${uri}`, '_blank');
};
