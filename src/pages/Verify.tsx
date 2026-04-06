import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, ArrowRight, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { resendCode } from "@/services/auth";

const CODE_LENGTH = 6;

const Verify = () => {
  const location = useLocation();
  const email = (location.state as any)?.email || "";
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verify } = useAuth();

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const chars = value.split("").filter((c) => /\d/.test(c)).slice(0, CODE_LENGTH);
      const newCode = [...code];
      chars.forEach((c, i) => {
        if (index + i < CODE_LENGTH) newCode[index + i] = c;
      });
      setCode(newCode);
      const nextIdx = Math.min(index + chars.length, CODE_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    if (value && !/\d/.test(value)) return; // only digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== CODE_LENGTH) {
      toast({
        title: "Incomplete Code",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await verify(email, fullCode);
      toast({
        title: "Email Verified! ✅",
        description: "Welcome to FraudGuard!",
      });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Verification Failed",
        description:
          err instanceof Error ? err.message : "Invalid code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const msg = await resendCode(email);
      toast({
        title: "Code Sent",
        description: msg || "A new verification code has been sent to your email.",
      });
    } catch (err) {
      toast({
        title: "Resend Failed",
        description:
          err instanceof Error ? err.message : "Failed to resend code.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <span className="font-bold text-2xl">
            <span className="gradient-text">Fraud</span>
            <span className="text-foreground">Guard</span>
          </span>
        </Link>

        {/* Verify Card */}
        <div className="glass-card-elevated p-8">
          {/* Mail Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground">
              We sent a 6-digit code to
              <br />
              <span className="text-primary font-medium">{email}</span>
            </p>
          </div>

          {/* Code Inputs */}
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: CODE_LENGTH }).map((_, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={index === 0 ? CODE_LENGTH : 1}
                value={code[index]}
                onChange={(e) => handleCodeChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0}
                className="w-12 h-14 text-center text-xl font-bold border-2 focus:border-primary transition-colors"
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleVerify}
            disabled={isLoading || code.join("").length !== CODE_LENGTH}
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                Verify Email
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isResending}
              className="text-primary"
            >
              <RotateCw className={`h-4 w-4 mr-1 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
          </div>

          {/* Timer hint */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Code expires in 10 minutes
          </p>
        </div>

        {/* Back to login */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="text-primary hover:underline font-medium">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Verify;
