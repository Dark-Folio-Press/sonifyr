import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Music, Star, ArrowRight, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import RotatingHeroText from "@/components/rotating-hero-text";
import AnimatedPage from "@/components/animated-page";

/* ─────────────────────────────
   Validation
───────────────────────────── */

const birthDataSchema = z.object({
  birthInfo: z
    .string()
    .min(1, "Birth information is required")
    .refine((value) => {
      const pattern =
        /^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}\s+(am|pm)\s+.+,.+$/i;
      return pattern.test(value.trim());
    }, {
      message:
        "Use format: mm/dd/yyyy 00:00 am/pm City, Country (e.g. 3/15/1990 2:30 pm New York, USA)",
    }),
});

type BirthData = z.infer<typeof birthDataSchema>;

/* ─────────────────────────────
   Component
───────────────────────────── */

export default function Landing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<BirthData>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      birthInfo: "",
    },
  });

  /* Spotify connection status */
  const { data: spotifyStatus, refetch } = useQuery({
    queryKey: ["/api/spotify/status"],
    refetchOnWindowFocus: true,
  });

  const isSpotifyConnected = (spotifyStatus as any)?.connected;

  /* Handle redirect after Spotify OAuth */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("spotify") === "connected") {
      refetch();
      toast({
        title: "Spotify connected",
        description: "Enter your birth details to continue.",
      });
      window.history.replaceState({}, "", "/");
    }
  }, [refetch, toast]);

  /* Playlist generation */
  const generatePlaylist = useMutation({
    mutationFn: async (birthData: any) => {
      setIsGenerating(true);
      const res = await fetch("/api/generate-personalized-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate playlist");
      }

      return res.json();
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      localStorage.setItem("guestPlaylist", JSON.stringify(data.playlist));
      setLocation("/playlist-result?personalized=true");
    },
    onError: (err: any) => {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  /* Submit */
  const onSubmit = (data: BirthData) => {
    const match = data.birthInfo.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s+(am|pm)\s+(.+)$/i
    );

    if (!match) {
      toast({
        title: "Invalid format",
        description:
          "Use: mm/dd/yyyy 00:00 am/pm City, Country",
        variant: "destructive",
      });
      return;
    }

    const [, m, d, y, h, min, ampm, location] = match;

    let hour = parseInt(h, 10);
    if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;

    generatePlaylist.mutate({
      birthDate: `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`,
      birthTime: `${hour.toString().padStart(2, "0")}:${min}`,
      birthLocation: location.trim(),
    });
  };

  /* ───────────────────────────── */

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <Music className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">🎵 Sonifyr</h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              Turn planetary data into sound.
            </p>
            <RotatingHeroText />
          </div>

          {/* Main Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-3xl">
                Your Music DNA + Your Cosmic Blueprint
              </CardTitle>
              <CardDescription className="text-center text-lg">
                {isSpotifyConnected
                  ? "Spotify connected — enter your birth details."
                  : "Connect Spotify to unlock your personalized playlist."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!isSpotifyConnected ? (
                <div className="text-center space-y-6">
                  <Heart className="h-12 w-12 text-purple-600 mx-auto" />
                  <p className="text-purple-700">
                    We analyze your listening history to tune the cosmos to *you*.
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/api/spotify/connect")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6 text-lg"
                  >
                    <Music className="mr-2 h-5 w-5" />
                    Connect Spotify
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    ✓ Connected as{" "}
                    {(spotifyStatus as any)?.user?.display_name || "User"}
                  </div>

                  <div>
                    <Label htmlFor="birthInfo">Birth Information</Label>
                    <Input
                      id="birthInfo"
                      placeholder="3/15/1990 2:30 pm New York, USA"
                      {...form.register("birthInfo")}
                      className="text-center py-6"
                    />
                    {form.formState.errors.birthInfo && (
                      <p className="text-sm text-red-500 text-center mt-2">
                        {form.formState.errors.birthInfo.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 py-6 text-lg"
                  >
                    {isGenerating ? "Consulting the stars…" : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate My Playlist
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            {[
              ["Astrological Analysis", Star, "Your chart, decoded."],
              ["AI Curation", Music, "Frequencies that fit."],
              ["Weekly Playlists", Sparkles, "Aligned with the sky."],
            ].map(([title, Icon, desc], i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
