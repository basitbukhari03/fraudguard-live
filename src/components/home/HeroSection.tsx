import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Zap, Lock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">XGBoost Powered Detection</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Detect Fraud with
            <br />
            <span className="gradient-text glow-text">99.72% Accuracy</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Protect your financial transactions with our advanced machine learning system. 
            Real-time fraud detection powered by XGBoost trained on 284,807 transactions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button variant="hero" size="xl" className="group">
                Start Detecting
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="heroOutline" size="xl">
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Shield, label: "Accuracy", value: "99.72%" },
              { icon: BarChart3, label: "ROC-AUC", value: "0.981" },
              { icon: Lock, label: "Transactions", value: "284,807" },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-card group cursor-default"
              >
                <stat.icon className="h-8 w-8 text-primary mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold font-mono gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
