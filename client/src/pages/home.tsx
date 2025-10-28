import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Trophy, TrendingUp, Users, CheckCircle, PlayCircle } from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Problems", value: "500+", icon: Code2 },
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Solutions", value: "1M+", icon: CheckCircle },
  ];

  const features = [
    {
      icon: Code2,
      title: "Vast Problem Library",
      description: "Access hundreds of coding challenges across various difficulty levels and topics",
    },
    {
      icon: PlayCircle,
      title: "Instant Execution",
      description: "Run your code instantly and get immediate feedback on test cases",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed statistics and achievement tracking",
    },
    {
      icon: Trophy,
      title: "Compete & Learn",
      description: "Join the leaderboard and learn from community solutions",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Master Coding Challenges,
            <br />
            <span className="text-primary">One Problem at a Time</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sharpen your programming skills with curated coding challenges. Practice algorithms,
            data structures, and problem-solving techniques.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/problems">
              <div>
                <Button size="lg" className="gap-2" data-testid="button-start-coding">
                  <Code2 className="w-5 h-5" />
                  Start Coding
                </Button>
              </div>
            </Link>
            <Link href="/problems">
              <div>
                <Button size="lg" variant="outline" data-testid="button-browse-problems">
                  Browse Problems
                </Button>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need to Excel
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Level Up Your Skills?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers improving their coding skills every day
          </p>
          <Link href="/problems">
            <div>
              <Button size="lg" data-testid="button-get-started">Get Started Free</Button>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
