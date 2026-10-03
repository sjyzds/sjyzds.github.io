const button = document.querySelector('[data-copy-email]');
const status = document.querySelector('.copy-status');
let resetTimer;
button?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(button.dataset.copyEmail);
    button.textContent = 'Copied';
    status.textContent = 'Email address copied.';
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { button.textContent = 'Copy email'; status.textContent = ''; }, 3500);
  } catch {
    status.textContent = 'Please select and copy the email address, or click it to open your email app.';
  }
});
