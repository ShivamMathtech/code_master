import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PlayCircle, Send, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Problem } from "@shared/schema";

export default function ProblemDetail() {
  const [, params] = useRoute("/problems/:slug");
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<any>(null);

  const { data: problem, isLoading } = useQuery<Problem>({
    queryKey: ["/api/problems", params?.slug],
    enabled: !!params?.slug,
  });

  const runCodeMutation = useMutation({
    mutationFn: async (codeToRun: string) => {
      return apiRequest("POST", `/api/problems/${params?.slug}/run`, {
        code: codeToRun,
      });
    },
    onSuccess: (data) => {
      setTestResults(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to run code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (codeToSubmit: string) => {
      return apiRequest("POST", `/api/problems/${params?.slug}/submit`, {
        code: codeToSubmit,
      });
    },
    onSuccess: (data) => {
      setTestResults(data);
      if (data.status === "accepted") {
        toast({
          title: "Accepted!",
          description: "Your solution passed all test cases.",
        });
      } else {
        toast({
          title: "Not Accepted",
          description: `Your solution ${data.status.replace("_", " ")}.`,
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit code. Please try again.",
        variant: "destructive",
      });
    },
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
          <p className="text-muted-foreground">The problem you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  if (!code) {
    setCode(problem.starterCode);
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="w-full lg:w-2/5 border-r overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <Badge className={`${getDifficultyColor(problem.difficulty)} border capitalize`} data-testid={`badge-difficulty-${problem.difficulty}`}>
                {problem.difficulty}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
              <TabsTrigger value="examples" data-testid="tab-examples">Examples</TabsTrigger>
              <TabsTrigger value="constraints" data-testid="tab-constraints">Constraints</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4 mt-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{problem.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4 mt-4">
              {problem.examples.map((example: any, idx: number) => (
                <Card key={idx} className="p-4">
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-semibold mb-1">Input:</div>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{example.input}</code>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">Output:</div>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Explanation:</div>
                        <p className="text-sm text-muted-foreground">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="constraints" className="mt-4">
              <ul className="space-y-2">
                {problem.constraints.map((constraint: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span>•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{problem.category}</Badge>
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Acceptance Rate: {problem.acceptanceRate}%</div>
              <div>Total Submissions: {problem.totalSubmissions.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-full font-mono text-sm resize-none"
            placeholder="Write your solution here..."
            data-testid="textarea-code-editor"
          />
        </div>

        {testResults && (
          <div className="border-t p-4 max-h-48 overflow-y-auto">
            {testResults.status && (
              <div className="flex items-center gap-2 mb-3">
                {testResults.status === "accepted" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-semibold capitalize">{testResults.status.replace("_", " ")}</span>
              </div>
            )}
            {testResults.testResults && (
              <div className="space-y-2">
                {testResults.testResults.map((result: any, idx: number) => (
                  <div
                    key={idx}
                    className={`text-sm p-2 rounded ${
                      result.passed ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}
                    data-testid={`test-result-${idx}`}
                  >
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="font-mono">
                        Test Case {idx + 1}: {result.passed ? "Passed" : "Failed"}
                      </span>
                    </div>
                    {!result.passed && result.error && (
                      <div className="mt-2 text-xs font-mono text-red-600 dark:text-red-400">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="border-t p-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCode(problem.starterCode)}
            data-testid="button-reset"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => runCodeMutation.mutate(code)}
            disabled={runCodeMutation.isPending}
            data-testid="button-run"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {runCodeMutation.isPending ? "Running..." : "Run Code"}
          </Button>
          <Button
            onClick={() => submitMutation.mutate(code)}
            disabled={submitMutation.isPending}
            data-testid="button-submit"
          >
            <Send className="w-4 h-4 mr-2" />
            {submitMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
