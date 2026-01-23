import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { User } from 'lucide-react';

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            2026 Success <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real transformations from our growing community using cutting-edge 2026 methods.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.25, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border/50 border-dashed text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground/70 italic mb-4">
                "Coming soon – real 2026 transformations using our advanced algorithms"
              </p>
              <div className="w-24 h-3 mx-auto rounded bg-secondary" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
