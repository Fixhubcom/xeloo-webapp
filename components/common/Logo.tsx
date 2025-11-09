
import React from 'react';

interface LogoProps {
  className?: string;
}

// Base64 encoded logo image with transparent background
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAdNSURBVHhe7Vp/bBRVGP99Z/ZutzvQ2gK1pYAWpWnBxGg0JgYbfNBPg4kGKQiExqgiGh80GB80/qiJRsSACEaMxMSYQBRi/AOkD1hKiQuQplAChUItUKDttrvd2d3ZnZ3H9d/sdrvdnZ3ZbneHlPzkzOzOfb7zzXzffPNN7n0wDAOnmjC1jBqOdg51DHWiUDRfDhsrR2uHGoY6xDoR/x+aY3O0c6hjqBOhUDRfDosV7RzqGOoE60T8f2iOzXGFc22p+w3tHOoY6kTgB7Tf/E79/v2k9T1OEZ1jS92v0c6hjqFOEDhE/D8+h+a+XqE4GsdL3f/RzqGOoY4D/4B+3kL2r+gD6pX1fUrwNchS9+s0tHOoY6gTge4D+lUKe43O0c6hjqBPhF9X1G8DXQ/742/RzqGOoE4DuA/pVCnuNztHOoY6gT4BfV9RvA18DXoT/tHOoY6gTgO4D+lUKe43O0c6hjqBPhF9X1G8DXwBegP+0c6hjqBOD/Q/5KCnuOztHOoY6hToBfVNdvAF8DX4H+tHOoY6gTgP4D+lUKe47O0c6hjqFOfF+U3+j6DeCrQfF8OXwO/WjnUMdQJ/4f0D+lUKe4LO0c6hjqRPiL6vqN4KvQf1/7aefQzqGOA/8A/a5A8Xw57I7O0c6hjqFO/D+gX6Ww1+gD6mP1e9K+v4/sHOoY6kT4BfV9BfB1qN//+L0D+tPOoY6hTjQ/pH9Koa5R+74+0L6/j+wc6hjqRPiL6vqN4GtQ/x/+8U79/n2gfe8g+8c6hjqROP9A/0ohz9E52jnUMdQJ8Ivq+g3ga1D/gH7aOdQx1AnA/4f8lRL2Gh2gPqZ+T9r395GdQx1Dnfh+I/+i+g3gq0HxfDl8Dv1o51DHUCf+H9A/pVDXqH1fH2jf30d2DnUMdSJ8RfX9BvA1qP/P3//8+fNbfz4r3b/RzqGOoU4A/j9E/0ohz9E52jnUMdQJ8Ivq+g3ga1D/gH7aOdQx1AnA/4f8lRL2GvU/p371d4v2/X1k51DHUCf+v9H/ov4N4KuC4vly+Bz60c6hjqFO/D+gf0qhzdH+j34QfbqL7Lh/150X7r9/rDufn892jnUMdWL8A/yL6vuN4OvR+p+n4+bLfvH2/X1k51DHUCceF6B/SiFP0TnUMdRoqL/z/N8u7y/7e87X7V325+e0c6hjqBPjL6rrN4CtRft72u56h8+1c6hjqBOA7wP6Vwp5js7RzqGOoU6AX1TXbwBfA1/oTzuHOoY6AXgf0K9SyHN0jnUMdYxG/338x5tffz8Wf/65L68/+rF+/f/h8p/T0c6hjqFOhF9U128AX//x/3q123++Xo/X//3w6fWbWz/r53V6eunf592n84D+lUKeo3O0c6hjqBM0+sX1G8BXoP8B/bQf177P6X0Bf1KCPkfn0C8o/sT1G8BXoP8B/bQf177P6X0Bf1KCfkfn0C8o/sT1G8BXoP8B/bTf16m9L+BPStDnaBf0L+gH018Ld6yP12sUzhQUP1gUihQUX3c0X0cUjg0U/4f0P+0c6hjqBOA7wP6Vwp5js7RzqGOoU4gvqutXgK8GxePlsDt6N1gczRfD4vlyOFjRzqGOoU4A/ge0PxSiUDRfDosV7RzqGOoYoGg0Xw6LFQMw1QCMtWGo42hnUMfRztHOoY6kT8S2j8S2jnUMdQx1AnQqaqfF0vFiuZLZStHOoY6BmiqHw9XyxYM10+sKkcG68c6hjqGOoY6kT+P+H/4TnUMdQx1DFAUTg2Xg6LFYMw1YChGUajfaMdaudQx1DHyM7RzqGOoU5M1Y/6eYDiGOoY6higoBwbr4DFCsNWAIa1b6hnUMfIztHOoY6hTkzVj/p5gOIY6hjqGKCgHBuvoMUKw1YAhLd9QO4Y6RnaOdAx1DnViqkf0PEFxDPWMSqGg+XJYqBigKQaj/UY7hjoWdo50DHUMdWL6Qz3UMw7FMNQxRFE4Nl4BihUGbIpBqM9Qh0I7RzqGOoY6MX1DPeYxjsUw1DFEUTg2XgGKFQZsikGoz1AHQjuHOgY6hjozXb+hHuc4jsUw1DFEUTg2XgGKFQZsikGoz1AHQjuHOgY6hjpz/qF+1MMc4zEMYx1DFIWjc+PYeAUoVhiwKQajPkMdCO0c6hjqGOqYoihcOS6HxYrBigGKYjDqM9Sh0M6hjqGOoU5M1Y/6eYDiGOoY6higoBwbr2DFCsNWAIa1fUM9hjoWdo50DHUMdWJq31CPdYzDYRjqGKIoHJsvY8UKAzZFINRnaEChnUMdQx1DnbimX9CPcxzHYRjqGKIoHJsvY8UKAzZFINRnaEChnUMdQx1Dnbm+X9CPcxzHYRjqGKIoHJsvY8UKAzZFINRnaEChnUMdQx1Dnfn6Q/2ohyHGMRjGMKYxiqJwdDYej1eAYoUBmyIQ6jPUgdDOoY6hjqGOIYqCtfNiWCxbMFi1YFDagKEcR3WM7BzoGOoY6sQ/6vcf3hMV/xMawzAAA3zM+A/h1J9N+X4kngAAAABJRU5ErkJggg==';

const Logo: React.FC<LogoProps> = ({ className = 'text-3xl' }) => {
  // Check for a size class to make the image responsive
  const isLarge = className.includes('text-5xl');
  const imgSizeClass = isLarge ? 'w-14 h-14' : 'w-10 h-10';

  return (
    <div className={`flex items-center space-x-3`}>
      <img src={LOGO_BASE64} alt="Xeloo Logo" className={imgSizeClass} />
      <h1 className={`font-bold hidden sm:block ${className}`}>
        <span className="text-white">Xeloo</span>
        <span className="text-accent">.</span>
      </h1>
    </div>
  );
};

export default Logo;
