import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

interface GeneratorFormProps {
  onGenerate: (config: GeneratorConfig) => void;
  isLoading: boolean;
}

export interface GeneratorConfig {
  topic: string;
  tone: string;
  length: string;
  mode: string;
}

export const GeneratorForm = ({ onGenerate, isLoading }: GeneratorFormProps) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [mode, setMode] = useState("multi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate({ topic, tone, length, mode });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="topic">Topic or Idea</Label>
        <Input
          id="topic"
          placeholder="e.g., Sustainable fashion capsule wardrobe"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tone">Tone / Style</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="length">Output Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger id="length">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode">Mode</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multi">Multi (All)</SelectItem>
              <SelectItem value="text">Text Only</SelectItem>
              <SelectItem value="image">Image Prompt Only</SelectItem>
              <SelectItem value="code">Code Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity text-lg h-12"
        disabled={isLoading || !topic.trim()}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </form>
  );
};
