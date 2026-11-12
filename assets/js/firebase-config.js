window.DU_FIREBASE = {
  apiKey: 'AIzaSyCRND9Hh4Dq2O_4UQKyg2dIYpfhhftNTTE',
  authDomain: 'dallasunitedfc-3ed79.firebaseapp.com',
  projectId: 'dallasunitedfc-3ed79',
  storageBucket: 'dallasunitedfc-3ed79.firebasestorage.app',
  messagingSenderId: '500444717920',
  appId: '1:500444717920:web:35a94114485e73e0dd7405'
};

(function () {
  try {
    const q = location.search;
    if (/[?&]cloud=1/.test(q)) localStorage.setItem('du-cloud-local', '1');
    if (/[?&]cloud=0/.test(q)) localStorage.removeItem('du-cloud-local');
    const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|192\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname) || location.hostname === '';
    if (local && localStorage.getItem('du-cloud-local') !== '1') window.DU_FIREBASE = { ...window.DU_FIREBASE, apiKey: '' };
  } catch (e) {  }
})();
