import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

interface GeneratorFormProps {
  onGenerate: (config: GeneratorConfig) => void;
  isLoading: boolean;
}

export interface GeneratorConfig {
  prompt: string;
  tone: string;
  length: string;
  mode: string;
  textType?: string;
  imageStyle?: string;
  codeLanguage?: string;
}

export const GeneratorForm = ({ onGenerate, isLoading }: GeneratorFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [mode, setMode] = useState("text");
  const [textType, setTextType] = useState("story");
  const [imageStyle, setImageStyle] = useState("realistic");
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate({ prompt, tone, length, mode, textType, imageStyle, codeLanguage });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="prompt">Your Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Describe what you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Mode Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === "text"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-2xl mb-1">📝</div>
            <div className="font-semibold text-sm">Text</div>
          </button>
          <button
            type="button"
            onClick={() => setMode("image")}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === "image"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-2xl mb-1">🎨</div>
            <div className="font-semibold text-sm">Image</div>
          </button>
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === "code"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-2xl mb-1">💻</div>
            <div className="font-semibold text-sm">Code</div>
          </button>
        </div>
      </div>

      {/* Text Mode Options */}
      {mode === "text" && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="space-y-2">
            <Label htmlFor="textType">Text Type</Label>
            <Select value={textType} onValueChange={setTextType}>
              <SelectTrigger id="textType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="poem">Poem</SelectItem>
                <SelectItem value="social">Social Media Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>
      )}

      {/* Image Mode Options */}
      {mode === "image" && (
        <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/50">
          <Label htmlFor="imageStyle">Image Style</Label>
          <Select value={imageStyle} onValueChange={setImageStyle}>
            <SelectTrigger id="imageStyle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="artistic">Artistic</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="cartoon">Cartoon</SelectItem>
              <SelectItem value="3d-render">3D Render</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Code Mode Options */}
      {mode === "code" && (
        <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/50">
          <Label htmlFor="codeLanguage">Programming Language</Label>
          <Select value={codeLanguage} onValueChange={setCodeLanguage}>
            <SelectTrigger id="codeLanguage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
              <SelectItem value="ruby">Ruby</SelectItem>
              <SelectItem value="swift">Swift</SelectItem>
              <SelectItem value="kotlin">Kotlin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity text-lg h-12"
        disabled={isLoading || !prompt.trim()}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </form>
  );
};
