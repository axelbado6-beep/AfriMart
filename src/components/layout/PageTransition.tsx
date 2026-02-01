import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

type TransitionType = "slide-left" | "slide-right" | "slide-up" | "zoom" | "fade";

const getTransitionClass = (type: TransitionType, entering: boolean): string => {
  const transitions: Record<TransitionType, { enter: string; exit: string }> = {
    "slide-left": {
      enter: "animate-slide-in-left",
      exit: "translate-x-full opacity-0"
    },
    "slide-right": {
      enter: "animate-slide-in-right", 
      exit: "-translate-x-full opacity-0"
    },
    "slide-up": {
      enter: "animate-fade-in-up",
      exit: "translate-y-full opacity-0"
    },
    "zoom": {
      enter: "animate-scale-in",
      exit: "scale-90 opacity-0"
    },
    "fade": {
      enter: "animate-fade-in",
      exit: "opacity-0"
    }
  };

  return entering ? transitions[type].enter : transitions[type].exit;
};

// Determine transition based on route change
const getTransitionType = (from: string, to: string): TransitionType => {
  // Home to Catalog/Explore = slide left
  if (from === "/" && (to.includes("catalog") || to.includes("business"))) {
    return "slide-left";
  }
  
  // Catalog to Product = zoom
  if (from.includes("catalog") && to.includes("product")) {
    return "zoom";
  }
  
  // Going back (catalog to home) = slide right
  if ((from.includes("catalog") || from.includes("product")) && to === "/") {
    return "slide-right";
  }
  
  // Dashboard transitions = slide up
  if (to.includes("dashboard") || to.includes("settings") || to.includes("orders")) {
    return "slide-up";
  }
  
  // Auth = fade
  if (to.includes("auth")) {
    return "fade";
  }
  
  return "fade";
};

export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"entering" | "entered">("entering");
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setTransitionStage("entering");
      setDisplayChildren(children);
      setPrevPath(location.pathname);
      
      // Brief delay then mark as entered
      const timer = setTimeout(() => {
        setTransitionStage("entered");
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [children, location.pathname, prevPath]);

  const transitionType = getTransitionType(prevPath, location.pathname);
  
  return (
    <div 
      className={`transition-all duration-400 ease-out ${
        transitionStage === "entering" ? getTransitionClass(transitionType, true) : ""
      } ${className}`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
