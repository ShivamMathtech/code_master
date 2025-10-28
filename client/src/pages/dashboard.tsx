import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trophy, TrendingUp, Calendar } from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  recentSubmissions: Array<{
    id: string;
    problemTitle: string;
    problemSlug: string;
    status: string;
    submittedAt: string;
  }>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard"],
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "hard":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "accepted"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-total-solved">
                {stats?.totalSolved || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Problems completed</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Easy</CardTitle>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="stat-easy-solved">
                {stats?.easySolved || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Easy problems</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medium</CardTitle>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400" data-testid="stat-medium-solved">
                {stats?.mediumSolved || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Medium problems</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hard</CardTitle>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400" data-testid="stat-hard-solved">
                {stats?.hardSolved || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Hard problems</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentSubmissions.map((submission) => (
                  <Link key={submission.id} href={`/problems/${submission.problemSlug}`}>
                    <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover-elevate border" data-testid={`submission-${submission.id}`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{submission.problemTitle}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleDateString()} at{" "}
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(submission.status)} capitalize`} data-testid={`status-${submission.status}`}>
                        {submission.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No submissions yet. Start solving problems!</p>
                <Link href="/problems">
                  <span className="text-primary hover:underline mt-2 inline-block cursor-pointer">
                    Browse Problems
                  </span>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
