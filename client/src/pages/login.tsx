import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Music, LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Sonifyr
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect with Spotify to access your personalized cosmic journey
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Spotify Authentication Required</CardTitle>
            <CardDescription className="text-center">
              Sonifyr uses Spotify to create your personalized astrological playlists
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium text-purple-800 dark:text-purple-200">Spotify Premium Required</h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Due to Spotify's Development Mode restrictions, this app requires:
              </p>
              <ul className="text-sm text-purple-700 dark:text-purple-300 list-disc list-inside mt-2 space-y-1">
                <li>A Spotify Premium account</li>
                <li>Whitelisted email (limited to 5 users)</li>
                <li>Contact the administrator for access</li>
              </ul>
            </div>

            <Link href="/">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Music className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>

            <div className="text-center text-sm text-muted-foreground">
              <p>Authentication is handled through Spotify OAuth when generating playlists</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your Spotify data is used only for playlist generation
          </p>
        </div>
      </div>
    </div>
  );
}