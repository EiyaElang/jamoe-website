// Handle Fullscreen for WebGL iframe
const fullscreenBtn = document.getElementById('fullscreen-btn');
const iframe = document.getElementById('unity-iframe');

if (fullscreenBtn && iframe) {
  fullscreenBtn.addEventListener('click', () => {
    // Try to trigger Unity's internal fullscreen first
    try {
      if (iframe.contentWindow && iframe.contentWindow.unityInstance) {
        iframe.contentWindow.unityInstance.SetFullscreen(1);
        
        // Attempt to force landscape orientation on mobile
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch((e) => {
            console.log("Orientation lock not supported or denied.", e);
          });
        }
        return; // Unity will handle the fullscreen natively
      }
    } catch (e) {
      console.warn("Could not access Unity instance for fullscreen. Falling back to iframe fullscreen.", e);
    }
    
    // Fallback if Unity instance is not ready or cross-origin block
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { /* Firefox */
      iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { /* IE/Edge */
      iframe.msRequestFullscreen();
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
