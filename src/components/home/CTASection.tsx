import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card-elevated max-w-4xl mx-auto p-8 sm:p-12 text-center glow-border">
          <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-6">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Protecting Your <span className="gradient-text">Transactions</span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of users who trust FraudGuard to detect fraudulent transactions 
            with industry-leading accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button variant="glow" size="xl" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="xl">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
