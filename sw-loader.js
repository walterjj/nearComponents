const updateReady = () =>
  document.dispatchEvent(new CustomEvent('updateReady'));

const trackInstalling = worker => {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateReady();
    }
  });
};

export default () => {
  if (!('serviceWorker' in navigator)) {
    console.info('SW is not supported');
    return;
  }

  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      if (!navigator.serviceWorker.controller) {
        console.log("no controller" , registration)
        return;
      }

      if (registration.waiting) {
          console.log("waiting" , registration)
        return;
      }

      if (registration.installing) {
        return trackInstalling(registration.installing);
      }

      registration.addEventListener('updatefound', () => trackInstalling(registration.installing));
    }).catch(error => {
      console.warn('Error during service worker registration:', error);
    });
};
