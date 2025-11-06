// src/components/HoverImageScroller.tsx
import React, { useRef, useEffect } from "react";

interface TeamMember {
  id: number;
  name: string;
  image: string;
}

interface HoverImageScrollerProps {
  items: TeamMember[];
}

const HoverImageScroller: React.FC<HoverImageScrollerProps> = ({ items }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollSpeedRef = useRef(0.8); // base auto scroll speed
  const targetSpeedRef = useRef(0.8);
  const animationFrameRef = useRef<number | null>(null);

  const scrollLoop = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Smooth speed interpolation
    scrollSpeedRef.current +=
      (targetSpeedRef.current - scrollSpeedRef.current) * 0.05;

    // Apply scroll movement
    container.scrollLeft += scrollSpeedRef.current;

    // Infinite looping logic
    if (container.scrollLeft >= container.scrollWidth / 2) {
      container.scrollLeft = 0;
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft = container.scrollWidth / 2;
    }

    animationFrameRef.current = requestAnimationFrame(scrollLoop);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Duplicate content for infinite loop illusion
    container.innerHTML += container.innerHTML;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const containerWidth = container.offsetWidth;
      const scrollZoneWidth = containerWidth * 0.2;
      const maxSpeed = 6;

      if (window.innerWidth < 768) {
        targetSpeedRef.current = 0.8;
        return;
      }

      if (mouseX < scrollZoneWidth) {
        const percentage = 1 - mouseX / scrollZoneWidth;
        targetSpeedRef.current = -maxSpeed * percentage;
      } else if (mouseX > containerWidth - scrollZoneWidth) {
        const percentage =
          (mouseX - (containerWidth - scrollZoneWidth)) / scrollZoneWidth;
        targetSpeedRef.current = maxSpeed * percentage;
      } else {
        targetSpeedRef.current = 0.8; // normal auto-scroll
      }
    };

    const handleMouseLeave = () => {
      targetSpeedRef.current = 0.8;
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="flex w-full gap-6 overflow-x-hidden no-scrollbar cursor-pointer select-none"
    >
      {items.map((member) => (
        <div key={member.id} className="flex-shrink-0">
          <img
            src={member.image}
            alt={member.name}
            className="w-72 h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

export default HoverImageScroller;
