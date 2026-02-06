import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Music, UserPlus, Sparkles } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join the Cosmic Journey
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect with Spotify to unlock personalized astrological insights and music
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Spotify Authentication Required</CardTitle>
            <CardDescription className="text-center">
              Get started with personalized cosmic insights and music curation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium text-purple-800 dark:text-purple-200">Access Requirements</h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                Sonifyr uses Spotify to create personalized astrological playlists. Due to Spotify's Development Mode restrictions:
              </p>
              <ul className="text-sm text-purple-700 dark:text-purple-300 list-disc list-inside space-y-1">
                <li>A Spotify Premium account is required</li>
                <li>Access is limited to 5 whitelisted users</li>
                <li>Contact the administrator to request access</li>
                <li>Your Spotify email must be on the whitelist</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How It Works</h3>
              <ol className="text-sm text-blue-700 dark:text-blue-300 list-decimal list-inside space-y-1">
                <li>Go to the home page</li>
                <li>Enter your birth information for personalized playlists</li>
                <li>Connect your Spotify Premium account when prompted</li>
                <li>Enjoy your cosmic music journey!</li>
              </ol>
            </div>

            <Link href="/">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Music className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your Spotify data is used only for playlist generation and is not shared
          </p>
        </div>
      </div>
    </div>
  );
}