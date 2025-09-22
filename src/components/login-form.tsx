'use client';

import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Leaf} from 'lucide-react';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle authentication here.
    // For this demo, we'll just navigate to the dashboard.
    router.push('/dashboard');
  };

  return (
    <Card className="mx-auto max-w-sm border-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
          <Leaf className="text-primary" />
          Farmer Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              required
              defaultValue="farmer@example.com"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required defaultValue="password" />
          </div>
          <Button type="submit" className="w-full mt-2">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
