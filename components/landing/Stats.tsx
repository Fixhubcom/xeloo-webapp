
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedStatProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  startInView: boolean;
  useCommas?: boolean;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({ end, duration = 2000, prefix = '', suffix = '', startInView, useCommas = false }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!startInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = Math.floor(progress * end);
      
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, startInView]);

  return (
    <p className="text-4xl font-bold text-accent">
      {prefix}
      {useCommas ? count.toLocaleString() : count}
      {suffix}
    </p>
  );
};

const Stats: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <section ref={ref} className="py-20">
            <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <AnimatedStat end={50} prefix="+$" suffix="M" startInView={inView} />
                    <p className="text-gray-400">Annual profit</p>
                </div>
                <div>
                    <AnimatedStat end={5000} suffix="+" startInView={inView} useCommas />
                    <p className="text-gray-400">5 star review</p>
                </div>
                <div>
                    <AnimatedStat end={1} suffix="M+" startInView={inView} />
                    <p className="text-gray-400">Transaction</p>
                </div>
                <div>
                    <AnimatedStat end={10} suffix="K+" startInView={inView} />
                    <p className="text-gray-400">Happy businesses</p>
                </div>
            </div>
        </section>
    );
};

export default Stats;
