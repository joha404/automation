const animateReel = (
  reelRef,
  finalPosition,
  { delay = 0, duration = 3000, minSpins = 5, maxSpins = 8, blur = true } = {}
) => {
  return new Promise((resolve) => {
    if (!reelRef?.current) {
      resolve();
      return;
    }

    const strip = reelRef.current;
    const symbolHeight = 90;
    const symbolsCount = 7;

    setTimeout(() => {
      const totalSpins =
        minSpins + Math.floor(Math.random() * (maxSpins - minSpins + 1));
      const spinDistance = totalSpins * symbolsCount * symbolHeight;
      const targetOffset = finalPosition * symbolHeight;
      const totalDistance = spinDistance + targetOffset;

      const currentTransform = strip.style.transform;
      const currentY = currentTransform
        ? parseInt(currentTransform.match(/-?\d+/)?.[0] || 0)
        : 0;

      strip.style.transition = "none";
      strip.style.transform = `translateY(${currentY}px)`;
      strip.style.filter = "blur(0px)";

      void strip.offsetHeight;

      requestAnimationFrame(() => {
        strip.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0, 0.1, 1)`;

        if (blur) {
          strip.style.transition += `, filter ${duration}ms ease-out`;
          strip.style.filter = "blur(3px)";
        }

        strip.style.transform = `translateY(-${totalDistance}px)`;
      });

      if (blur) {
        setTimeout(() => {
          strip.style.filter = "blur(0px)";
        }, duration * 0.7);
      }

      const handleTransitionEnd = (e) => {
        if (e.propertyName !== "transform") return;

        strip.removeEventListener("transitionend", handleTransitionEnd);

        strip.style.transition = "none";
        strip.style.filter = "blur(0px)";

        resolve();
      };

      strip.addEventListener("transitionend", handleTransitionEnd);

      setTimeout(() => {
        strip.removeEventListener("transitionend", handleTransitionEnd);
        strip.style.transition = "none";
        strip.style.filter = "blur(0px)";
        resolve();
      }, duration + 500);
    }, delay);
  });
};

export default animateReel;
