if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/shopping-list/sw.js', { scope: '/shopping-list/' })})}