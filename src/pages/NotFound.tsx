
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glassmorphic border-slate-700/50 text-center">
        <CardContent className="pt-8 pb-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-xl font-semibold text-white">Page Not Found</h2>
            <p className="text-slate-400">
              The page you're looking for doesn't exist in the AcadLedger system.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="gradient-cyan-purple hover-scale"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
