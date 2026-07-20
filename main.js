// Handle Fullscreen for WebGL iframe
const fullscreenBtn = document.getElementById('fullscreen-btn');
const iframe = document.getElementById('unity-iframe');

if (fullscreenBtn && iframe) {
  const gameWrapper = document.querySelector('.game-container-wrapper');
  let isIOSFullscreen = false;

  fullscreenBtn.addEventListener('click', () => {
    // If already in iOS fallback fullscreen, exit it
    if (isIOSFullscreen) {
      gameWrapper.classList.remove('ios-fullscreen');
      fullscreenBtn.classList.remove('close-btn');
      fullscreenBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg> Fullscreen Mode`;
      isIOSFullscreen = false;
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Try to trigger Unity's internal fullscreen first
    try {
      if (!isIOS && iframe.contentWindow && iframe.contentWindow.unityInstance) {
        iframe.contentWindow.unityInstance.SetFullscreen(1);
        
        // Attempt to force landscape orientation on mobile
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
        return; // Unity will handle the fullscreen natively
      }
    } catch (e) {
      console.warn("Could not access Unity instance for fullscreen. Falling back to iframe fullscreen.", e);
    }
    
    // Fallback if Unity instance is not ready or cross-origin block
    if (!isIOS && iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (!isIOS && iframe.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      iframe.webkitRequestFullscreen();
    } else {
      // iOS Safari Fallback (CSS Fullscreen)
      gameWrapper.classList.add('ios-fullscreen');
      fullscreenBtn.classList.add('close-btn');
      fullscreenBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      isIOSFullscreen = true;
      
      // Prompt user to rotate device manually since iOS doesn't support lock
      if (window.innerHeight > window.innerWidth) {
        // Just a subtle visual cue could go here, but usually users rotate automatically
      }
    }

    // Fallback orientation lock
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (e) {}
  });
}

// Optional: Add smooth scrolling offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for navbar
        behavior: 'smooth'
      });
    }
  });
});
