import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppData } from '@/context/AppDataContext';
import { getAssetUrl } from '@/lib/assetUrl';

export default function Login() {
  const { login } = useAppData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) return;

    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/profile');
    } else {
      setLoginError(
        result.message ?? 'Invalid email or password. Please check your details and try again.'
      );
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            <CardTitle className="text-2xl text-center font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert variant="destructive" className="mb-5" role="alert">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-11 h-11 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
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
                  <p id="password-error" role="alert" className="text-sm text-destructive">
                    {errors.password}
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
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
