import {LoginForm} from '@/components/login-form';
import {Leaf} from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="z-10 flex flex-col items-center space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-2">
          <Leaf size={40} />
          Verdant Harvests
        </h1>
        <p className="text-muted-foreground">
          Track your harvests, earn rewards, and grow with us.
        </p>
      </div>
      <div className="z-10 mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
