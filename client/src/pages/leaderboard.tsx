import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  username: string;
  solvedCount: number;
}

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <Award className="w-6 h-6 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top performers based on problems solved
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Coders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between gap-4 p-4 rounded-lg ${
                      index < 3
                        ? "bg-primary/5 border-2 border-primary/20"
                        : "border hover-elevate"
                    }`}
                    data-testid={`leaderboard-entry-${index + 1}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center">
                        {index < 3 ? (
                          getRankIcon(index + 1)
                        ) : (
                          <span className="text-lg font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold" data-testid={`username-${entry.username}`}>
                          {entry.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.solvedCount} {entry.solvedCount === 1 ? "problem" : "problems"} solved
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary" data-testid={`score-${entry.solvedCount}`}>
                      {entry.solvedCount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p>No rankings yet. Be the first to solve problems!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
