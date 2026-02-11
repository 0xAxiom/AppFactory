function extractProductInfo() {
  const asin = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1];

  const priceElement = document.querySelector(
    '.a-price-whole, .a-price .a-offscreen'
  );
  let price = null;

  if (priceElement) {
    const priceText = priceElement.textContent || priceElement.innerText;
    const priceMatch = priceText.match(/[\d,]+\.?\d*/);
    if (priceMatch) {
      price = parseFloat(priceMatch[0].replace(',', ''));
    }
  }

  const titleElement = document.querySelector(
    '#productTitle, [data-feature-name="title"] h1'
  );
  const title = titleElement ? titleElement.textContent.trim() : '';

  return { asin, price, title };
}

function createBasePayButton() {
  const { asin, price, title } = extractProductInfo();

  if (!asin) return;

  const container = document.createElement('div');
  container.className = 'base-pay-container';

  const button = document.createElement('button');
  button.className = 'base-pay-button';

  const logo = document.createElement('img');
  logo.src = chrome.runtime.getURL('BasePayWhiteLogo.png');
  logo.alt = 'Base Pay';

  button.appendChild(logo);

  button.addEventListener('click', () => {
    const checkoutUrl = `http://localhost:3000/checkout?asin=${asin}&price=${price}&title=${encodeURIComponent(title)}`;
    window.open(checkoutUrl, '_blank');
  });

  container.appendChild(button);

  return container;
}

function insertBasePayButton() {
  const existingButton = document.querySelector('.base-pay-container');
  if (existingButton) {
    console.log('Base Pay button already exists');
    return;
  }

  console.log('Trying to insert Base Pay button...');

  // FORCE IT AT THE TOP - create a sticky banner at the very top of the page
  const basePayButton = createBasePayButton();
  if (!basePayButton) {
    console.log('Failed to create base pay button');
    return;
  }

  // Create a banner container that sticks to the top
  const banner = document.createElement('div');
  banner.id = 'base-pay-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #f8f9fa;
    border-bottom: 2px solid #0000FF;
    padding: 10px 20px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  // Add some text and the button
  const text = document.createElement('span');
  text.textContent = 'Buy this with USDC on Base: ';
  text.style.cssText = `
    color: #333;
    font-weight: 600;
    margin-right: 15px;
    font-size: 14px;
  `;

  banner.appendChild(text);
  banner.appendChild(basePayButton);

  // Add some top margin to the body so content isn't hidden
  document.body.style.marginTop = '55px';

  // Insert at the very beginning of body
  document.body.insertBefore(banner, document.body.firstChild);

  console.log('Base Pay button inserted as top banner - GUARANTEED VISIBLE!');

  // Add a close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
    width: 25px;
    height: 25px;
  `;
  closeBtn.addEventListener('click', () => {
    banner.remove();
    document.body.style.marginTop = '0px';
  });
  banner.appendChild(closeBtn);
}

function init() {
  if (window.location.pathname.includes('/dp/')) {
    console.log(
      'Amazon product page detected, initializing Base Pay button insertion'
    );

    // Try multiple times with increasing delays
    setTimeout(insertBasePayButton, 1000);
    setTimeout(insertBasePayButton, 2000);
    setTimeout(insertBasePayButton, 3000);

    const observer = new MutationObserver(() => {
      if (!document.querySelector('.base-pay-container')) {
        insertBasePayButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
