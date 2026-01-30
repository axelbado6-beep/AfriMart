// Animation utility classes and components for Glovo-style interactions

// Stagger animation delays for list items
export const getStaggerDelay = (index: number, baseDelay: number = 50): string => {
  return `${index * baseDelay}ms`;
};

// Animation variants for common patterns
export const animationVariants = {
  // Card hover effects
  cardHover: "transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl",
  cardHoverSubtle: "transition-all duration-200 hover:scale-[1.01] hover:shadow-md",
  
  // Button interactions
  buttonPop: "transition-transform duration-150 hover:scale-105 active:scale-95",
  buttonBounce: "transition-all duration-200 hover:scale-110 active:scale-90",
  buttonGlow: "transition-all duration-300 hover:shadow-lg hover:shadow-primary/25",
  
  // Icon animations
  iconSpin: "transition-transform duration-300 hover:rotate-180",
  iconBounce: "transition-transform duration-200 hover:-translate-y-1",
  iconPulse: "transition-transform duration-150 hover:scale-125",
  
  // Text reveal
  textReveal: "transition-all duration-300 hover:tracking-wider",
  
  // Container effects
  containerGlow: "transition-shadow duration-300 hover:ring-2 hover:ring-primary/30",
  containerLift: "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
  
  // Input focus
  inputFocus: "transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/50",
  
  // Badge/tag
  tagPop: "transition-all duration-200 hover:scale-110 hover:bg-primary hover:text-primary-foreground",
};

// Common animation class combinations
export const animationPresets = {
  // Product card style (Glovo-like)
  productCard: `
    group relative overflow-hidden rounded-2xl bg-card border border-border
    transition-all duration-300 ease-out
    hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:border-primary/30
  `.trim().replace(/\s+/g, ' '),
  
  // Category pill
  categoryPill: `
    px-4 py-2 rounded-full text-sm font-medium
    transition-all duration-300 ease-out
    hover:scale-105 hover:shadow-md active:scale-95
    bg-muted hover:bg-primary hover:text-primary-foreground
  `.trim().replace(/\s+/g, ' '),
  
  // Action button (add to cart, etc.)
  actionButton: `
    relative overflow-hidden
    transition-all duration-300 ease-out
    hover:scale-105 hover:shadow-lg active:scale-95
    before:absolute before:inset-0 before:bg-white/10 before:scale-0 before:rounded-full
    before:transition-transform before:duration-500
    hover:before:scale-150
  `.trim().replace(/\s+/g, ' '),
  
  // Floating action button
  fab: `
    fixed bottom-6 right-6 z-50
    w-14 h-14 rounded-full shadow-xl
    transition-all duration-300 ease-out
    hover:scale-110 hover:shadow-2xl hover:-translate-y-1
    active:scale-95
  `.trim().replace(/\s+/g, ' '),
  
  // Navigation item
  navItem: `
    relative px-4 py-2 rounded-lg
    transition-all duration-200 ease-out
    hover:bg-muted hover:scale-105
    active:scale-95
  `.trim().replace(/\s+/g, ' '),
  
  // Image container with zoom effect
  imageZoom: `
    overflow-hidden rounded-xl
    [&>img]:transition-transform [&>img]:duration-500
    [&>img]:hover:scale-110
  `.trim().replace(/\s+/g, ' '),
  
  // Story circle
  storyCircle: `
    relative rounded-full overflow-hidden
    transition-all duration-300 ease-out
    hover:scale-110 hover:ring-4 hover:ring-primary/50
    active:scale-95
  `.trim().replace(/\s+/g, ' '),
  
  // Modal/dialog entrance
  modalEnter: "animate-fade-in-up",
  
  // Dropdown entrance
  dropdownEnter: "animate-slide-down",
  
  // Toast notification
  toastEnter: "animate-slide-in-right",
  toastExit: "animate-slide-out-right",
};

// CSS class helpers for dynamic animation styles
export const getAnimatedListItem = (index: number): React.CSSProperties => ({
  animationDelay: `${index * 50}ms`,
  animationFillMode: 'both',
});

// Ripple effect for buttons (to be used with onClick handlers)
export const createRipple = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add("ripple-effect");
  
  const existingRipple = button.getElementsByClassName("ripple-effect")[0];
  if (existingRipple) {
    existingRipple.remove();
  }
  
  button.appendChild(circle);
  
  setTimeout(() => circle.remove(), 600);
};

export default animationVariants;
