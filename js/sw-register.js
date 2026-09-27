// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              showUpdateToast();
            }
          });
        });
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });

  // Handle service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    // Handle messages from service worker
    console.log('Service Worker message:', event.data);
  });
}

// Show update toast when new version is available
function showUpdateToast() {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(9, 13, 38, 0.62);
    backdrop-filter: blur(16px) saturate(160%);
    border: 1px solid rgba(224, 242, 254, 0.16);
    border-radius: 999px;
    padding: 16px 24px;
    color: rgb(226, 240, 255);
    font-size: 0.86rem;
    font-weight: 600;
    box-shadow: 0 18px 40px -26px rgba(0, 0, 0, 1);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 16px;
    animation: slideUp 0.3s ease-out;
  `;
  
  toast.innerHTML = `
    <span>Nieuwe versie beschikbaar</span>
    <button id="update-btn" style="
      background: #4cc9f0;
      color: #0b1150;
      border: none;
      padding: 8px 16px;
      border-radius: 999px;
      font-weight: 600;
      cursor: pointer;
    ">Herladen</button>
  `;
  
  document.body.appendChild(toast);
  
  // Add update button handler
  document.getElementById('update-btn').addEventListener('click', () => {
    window.location.reload();
  });
  
  // Auto-hide after 30 seconds
  setTimeout(() => {
    toast.remove();
  }, 30000);
}

// Add animation for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);
