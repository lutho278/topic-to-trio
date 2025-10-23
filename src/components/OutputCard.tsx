import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface OutputCardProps {
  title: string;
  description: string;
  content: string;
  icon: React.ReactNode;
  language?: string;
  imageUrl?: string;
}

export const OutputCard = ({ title, description, content, icon, language, imageUrl }: OutputCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (imageUrl) {
      // Download image
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Image downloaded successfully!");
      } catch (error) {
        toast.error("Failed to download image");
      }
    } else {
      // Download text content
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${language === 'code' ? 'txt' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Downloaded successfully!");
    }
  };

  const handleShare = async () => {
    if (imageUrl) {
      // Share image - Facebook share URL
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
      window.open(facebookShareUrl, '_blank', 'width=600,height=400');
      toast.success("Opening Facebook share dialog!");
    } else if (navigator.share) {
      // Share text content using Web Share API
      try {
        await navigator.share({
          title: title,
          text: content,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share");
        }
      }
    } else {
      handleCopy();
      toast.success("Copied to clipboard! (Sharing not supported)");
    }
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
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title="Copy"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full rounded-lg"
          />
        ) : language === "code" ? (
          <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm border border-border">
            <code className="text-black">{content}</code>
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
