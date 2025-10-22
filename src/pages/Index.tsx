import { useState } from "react";
import { GeneratorForm, GeneratorConfig } from "@/components/GeneratorForm";
import { OutputCard } from "@/components/OutputCard";
import { FileText, Image, Code2 } from "lucide-react";
import { toast } from "sonner";

interface GeneratedContent {
  text?: string;
  imagePrompt?: string;
  code?: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = async (config: GeneratorConfig) => {
    setIsLoading(true);
    setGeneratedContent(null);

    try {
      // For now, using mock data. Will integrate with Lovable AI next
      const mockContent: GeneratedContent = {
        text: generateMockText(config),
        imagePrompt: generateMockImagePrompt(config),
        code: generateMockCode(config),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setGeneratedContent(mockContent);
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const shouldShowOutput = (mode: string, outputType: string) => {
    return mode === "multi" || mode === outputType;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            AI Multi-Modal Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate text, image prompts, and code from one idea.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Form Section */}
          <div className="bg-card rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-border/50">
            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Generating your content...</p>
            </div>
          )}

          {/* Output Section */}
          {generatedContent && !isLoading && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Generated Content</h2>
              
              {generatedContent.text && (
                <OutputCard
                  title="Text Output"
                  description="Creative content based on your topic"
                  content={generatedContent.text}
                  icon={<FileText className="h-5 w-5" />}
                />
              )}

              {generatedContent.imagePrompt && (
                <OutputCard
                  title="Image Prompt"
                  description="Ready for AI image generators"
                  content={generatedContent.imagePrompt}
                  icon={<Image className="h-5 w-5" />}
                />
              )}

              {generatedContent.code && (
                <OutputCard
                  title="Code Output"
                  description="Functional snippet inspired by your topic"
                  content={generatedContent.code}
                  icon={<Code2 className="h-5 w-5" />}
                  language="code"
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Built with ❤️ using Lovable.io
        </div>
      </footer>
    </div>
  );
};

// Mock generation functions (will be replaced with AI)
const generateMockText = (config: GeneratorConfig) => {
  return `This is a ${config.tone} ${config.length} text about ${config.topic}. In this comprehensive exploration, we delve into the multifaceted aspects of ${config.topic}, examining its impact and significance in today's world. The approach taken here reflects a ${config.tone} perspective, offering insights that are both practical and thought-provoking. As we navigate through the complexities of this subject, we uncover valuable perspectives that can inform and inspire.`;
};

const generateMockImagePrompt = (config: GeneratorConfig) => {
  return `Prompt: Create a visually stunning ${config.tone} composition featuring ${config.topic}. The scene should be set in a modern, minimalist environment with soft natural lighting streaming from the left. Use a color palette of muted earth tones with pops of vibrant accent colors. The style should be clean and contemporary, with careful attention to composition and balance. Include subtle textures and depth to create visual interest. The mood should be inspiring and aspirational, with a focus on clarity and sophistication. Shot with a 50mm lens, f/2.8, natural depth of field.`;
};

const generateMockCode = (config: GeneratorConfig) => {
  return `<!-- ${config.topic} Card Component -->
<div class="card" style="
  max-width: 400px;
  padding: 2rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
">
  <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">
    ${config.topic}
  </h2>
  <p style="margin: 0; opacity: 0.9; line-height: 1.6;">
    A beautiful card component with gradient background
    and modern styling. Perfect for showcasing content.
  </p>
  <button style="
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  ">
    Learn More
  </button>
</div>`;
};

export default Index;
