let userId = document.getElementById("userID");

const PUBLIC_VAPID_KEY = 'BP7aAteJ-g3FyfgPuMmLjFvPJHEfD2pTRIDmiW6hHHUxpm1Fsq1Prx80EIEi7JW_rZ1GS2kEA4wj3vVYQSlsqN4';

//convert the PUBLIC_VAPID_KEY to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

const socialNetworkSubscription = async () => {

    //service worker registration
    const register = await navigator.serviceWorker.register('/assets/js/custom/ServicesWorker.js', { scope: '/assets/js/custom/' });

    //subscribe the user to the push service
    const subscriptions = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    let container = Object.assign(subscriptions)
    //send the subscription to the server
    await fetch('/',{
        method: 'POST',
        body: JSON.stringify({userId: userId.value, subscriptions: container}),
        headers: {
            "content-type": "application/json"
        }
    });

    console.log('in the logging push subscription');
}

socialNetworkSubscription();