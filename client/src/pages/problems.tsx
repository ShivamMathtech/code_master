import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Clock, Search, Filter } from "lucide-react";
import { useState } from "react";
import type { Problem } from "@shared/schema";

export default function Problems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const { data: problems, isLoading } = useQuery<Problem[]>({
    queryKey: ["/api/problems"],
  });

  const categories = Array.from(new Set(problems?.map((p) => p.category) || []));

  const filteredProblems = problems?.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter.length === 0 || difficultyFilter.includes(problem.difficulty);
    const matchesCategory =
      categoryFilter.length === 0 || categoryFilter.includes(problem.category);
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const toggleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilter((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Problem Set</h1>
          <p className="text-muted-foreground">
            Solve coding challenges and improve your skills
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Card className="p-4 sticky top-20">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4" />
                    <h3 className="font-semibold">Search</h3>
                  </div>
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="input-search-problems"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4" />
                    <h3 className="font-semibold">Difficulty</h3>
                  </div>
                  <div className="space-y-2">
                    {["easy", "medium", "hard"].map((difficulty) => (
                      <div key={difficulty} className="flex items-center gap-2">
                        <Checkbox
                          id={difficulty}
                          checked={difficultyFilter.includes(difficulty)}
                          onCheckedChange={() => toggleDifficultyFilter(difficulty)}
                          data-testid={`checkbox-${difficulty}`}
                        />
                        <label
                          htmlFor={difficulty}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {difficulty}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={category}
                          checked={categoryFilter.includes(category)}
                          onCheckedChange={() => toggleCategoryFilter(category)}
                          data-testid={`checkbox-${category.toLowerCase()}`}
                        />
                        <label htmlFor={category} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {(difficultyFilter.length > 0 || categoryFilter.length > 0 || searchTerm) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setDifficultyFilter([]);
                      setCategoryFilter([]);
                      setSearchTerm("");
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          </aside>

          <div className="lg:col-span-3">
            <div className="space-y-3">
              {filteredProblems && filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <Link key={problem.id} href={`/problems/${problem.slug}`}>
                    <Card className="p-4 hover-elevate cursor-pointer" data-testid={`card-problem-${problem.slug}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <h3 className="font-semibold text-lg truncate">
                              {problem.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge
                              className={`${getDifficultyColor(problem.difficulty)} border capitalize`}
                              data-testid={`badge-difficulty-${problem.difficulty}`}
                            >
                              {problem.difficulty}
                            </Badge>
                            <Badge variant="outline" data-testid={`badge-category-${problem.category.toLowerCase()}`}>
                              {problem.category}
                            </Badge>
                            {problem.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm text-muted-foreground">
                            {problem.acceptanceRate}% Acceptance
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {problem.totalSubmissions.toLocaleString()} submissions
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No problems found matching your filters
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
