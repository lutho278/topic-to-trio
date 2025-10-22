import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface OutputCardProps {
  title: string;
  description: string;
  content: string;
  icon: React.ReactNode;
  language?: string;
}

export const OutputCard = ({ title, description, content, icon, language }: OutputCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elegant)] transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary">{icon}</div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {language === "code" ? (
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{content}</code>
          </pre>
        ) : (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
