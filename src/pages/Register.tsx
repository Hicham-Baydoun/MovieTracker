import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppData } from '@/context/AppDataContext';
import { getAssetUrl } from '@/lib/assetUrl';

// All 5 rules must pass before form can submit.
const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number (0–9)', test: (p: string) => /\d/.test(p) },
  { label: 'Special character (!@#…)', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

export default function Register() {
  const { movies, tvShows, registerUser } = useAppData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRulesPassed = PASSWORD_RULES.filter((r) => r.test(formData.password));
  const allRulesPassed = passwordRulesPassed.length === PASSWORD_RULES.length;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!allRulesPassed) {
      newErrors.password = 'Password does not meet all security requirements below';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!validateForm()) return;

    setIsLoading(true);

    const result = await registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setRegisterError(result.message ?? 'Unable to create account. Please try again.');
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-border/50">
          <CardContent className="p-10 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your account has been created. Redirecting you to login…
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2.5">
              <img
                src={getAssetUrl('assets/images/logo.png')}
                alt="Movie Buddy logo"
                className="h-11 w-11 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                Movie Buddy
              </span>
            </Link>
          </div>

          <Card className="shadow-xl border-border/50">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center font-bold">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              {registerError && (
                <Alert variant="destructive" className="mb-5" role="alert">
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Username */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`pl-10 h-11 ${errors.username ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={errors.username ? 'true' : 'false'}
                      aria-describedby={errors.username ? 'username-error' : undefined}
                    />
                  </div>
                  {errors.username && (
                    <p id="username-error" role="alert" className="text-sm text-destructive">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" role="alert" className="text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-11 h-11 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={errors.password ? 'true' : 'false'}
                      aria-describedby="password-requirements"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}

                  {/* Password requirements checklist */}
                  {formData.password && (
                    <div
                      id="password-requirements"
                      className="mt-2 p-3 rounded-lg bg-muted/60 border border-border/50 space-y-1.5"
                      aria-live="polite"
                      aria-label="Password requirements"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold text-foreground">
                          Security requirements
                        </span>
                      </div>
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(formData.password);
                        return (
                          <div key={rule.label} className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                passed ? 'bg-green-500' : 'bg-muted-foreground/25'
                              }`}
                            >
                              {passed && <Check className="h-2.5 w-2.5 text-white" />}
                            </div>
                            <span
                              className={`text-xs transition-colors ${
                                passed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                              }`}
                            >
                              {rule.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 pr-11 h-11 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                      aria-describedby={errors.confirmPassword ? 'confirm-pw-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p id="confirm-pw-error" role="alert" className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="space-y-1.5">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setFormData((prev) => ({ ...prev, agreeTerms: isChecked }));
                        if (isChecked && errors.agreeTerms) {
                          setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                        }
                      }}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="agreeTerms"
                      className="text-sm font-normal leading-relaxed cursor-pointer"
                    >
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeTerms && (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 cursor-pointer shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats strip */}
      <section className="py-8 bg-muted/40 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-10 md:gap-20">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary tabular-nums">{movies.length}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Movies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary tabular-nums">{tvShows.length}</p>
              <p className="text-sm text-muted-foreground mt-0.5">TV Shows</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary tabular-nums">1K+</p>
              <p className="text-sm text-muted-foreground mt-0.5">Users</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
