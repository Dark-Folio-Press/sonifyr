import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Info } from "lucide-react";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to home after a brief moment to show the message
    const timer = setTimeout(() => {
      setLocation("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Info className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Password Reset Not Available
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            This app uses Spotify-only authentication
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Authentication Method Changed</CardTitle>
            <CardDescription className="text-center">
              Sonifyr now uses Spotify OAuth exclusively
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 rounded-lg p-4">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Traditional email/password authentication has been removed. All authentication is now handled through Spotify when you create or export playlists.
              </p>
            </div>

            <Button 
              onClick={() => setLocation("/")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Music className="mr-2 h-4 w-4" />
              Go to Home
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Redirecting to home in 5 seconds...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
