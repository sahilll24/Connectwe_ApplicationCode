import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">C</span>
              </div>
              <span className="font-heading font-bold text-xl">ConnectWe</span>
            </Link>
            <p className="text-sm text-muted-foreground">Discover events. Build communities. Connect with people who share your passions.</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/events" className="hover:text-foreground transition-colors">Browse Events</Link></li>
              <li><Link to="/register" className="hover:text-foreground transition-colors">Create Account</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 ConnectWe. All rights reserved.</p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
              <a key={s} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
