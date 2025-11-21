"use client"

import * as React from "react"
import { Loader2, Send, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { executeService } from "@/app/actions"
import type { Service } from "@/lib/services"

export function ServiceInterface({ service }: { service: Service }) {
  const [prompt, setPrompt] = React.useState("")
  const [result, setResult] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const response = await executeService(service.id, prompt, service.cost)
      if (response.success) {
        setResult(response.data)
        toast.success("Content generated successfully!")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)]">
      <Card className="border-border bg-card/50 flex flex-col">
        <CardContent className="flex-1 p-6 flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="flex-1 mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Your Prompt</label>
              <Textarea
                placeholder="Describe what you want to create..."
                className="h-full min-h-[200px] resize-none border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Cost: <span className="text-primary font-medium">{service.cost} credits</span>
              </span>
              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 flex flex-col">
        <CardContent className="flex-1 p-6 bg-background/30 m-1 rounded-lg border border-border/50 overflow-auto">
          {result ? (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">Result</h3>
              <div className="whitespace-pre-wrap text-foreground">{result}</div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                <Send className="h-6 w-6 opacity-50" />
              </div>
              <p>Enter a prompt to see the magic happen</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
