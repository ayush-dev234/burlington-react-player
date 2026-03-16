export const toggleContrast = (): void => {
  document.body.classList.toggle("high-contrast");
};

export const increaseText = (): void => {
  document.body.classList.toggle("large-text");
};

export const changeSpacing = (): void => {
  document.body.classList.toggle("text-spacing");
};

export const toggleAnimations = (): void => {
  document.body.classList.toggle("reduce-motion");
};

export const toggleRead = (): void => {
  const text = document.body.innerText;
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
};

export const resetAccessibility = (): void => {
  document.body.classList.remove(
    "high-contrast",
    "large-text",
    "text-spacing",
    "reduce-motion"
  );
};