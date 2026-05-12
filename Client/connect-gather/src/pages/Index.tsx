import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, ArrowRight, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { eventsAPI } from "@/lib/api";
import { testimonials } from "@/lib/mock-data";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, categoriesRes, eventsRes] = await Promise.all([
          eventsAPI.getFeatured(),
          eventsAPI.getCategories(),
          eventsAPI.getAll(),
        ]);
        setFeatured(featuredRes.data.events);
        setCategories(categoriesRes.data.categories);
        setUpcoming(eventsRes.data.events.slice(0, 6));
      } catch (error) {
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="public" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.06]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight"
              variants={fadeUp}
              custom={0}
            >
              Discover-Connect {" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
                With Real Events Near You...
              </span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
              variants={fadeUp}
              custom={1}
            >
              Join thousands of people discovering amazing events and building meaningful connections in their communities..........
            </motion.p>
            {/* <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              variants={fadeUp}
              custom={2}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, topics, or locations..."
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              <Button size="lg" className="h-12 rounded-xl px-6">
                Search
              </Button>
            </motion.div> */}
            {/* <motion.div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground" variants={fadeUp} custom={3}>
              <span>🔥 <strong className="text-foreground">24+</strong> events</span>
              <span>👥 <strong className="text-foreground">50+</strong> members</span>
              <span>🌍 <strong className="text-foreground">12+</strong> cities</span>
            </motion.div> */}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Browse Categories</h2>
          <Link to="/events" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <Link
                to="/events"
                className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-medium text-sm text-card-foreground">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count} events</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((event, i) => (
              <motion.div
                key={event._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Discover', desc: 'Browse events by category, location, or interest. Find what excites you.' },
              { step: '2', title: 'Register', desc: 'Sign up instantly and join events with a single click. No hassle.' },
              { step: '3', title: 'Connect', desc: 'Meet like-minded people, build friendships, and grow your community.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-heading font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Carousel */}
      {/* <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Upcoming Events</h2>
          <Link to="/events" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {upcoming.map((event) => (
              <div key={event._id} className="min-w-[320px] snap-start">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </section> */}

      {/* Testimonials */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">Loved by Community Builders</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl gradient-primary p-10 md:p-16 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Connect?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join thousands of community members discovering events and building meaningful connections.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="rounded-xl px-8 h-12 font-semibold">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
