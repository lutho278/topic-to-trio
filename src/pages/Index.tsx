import { useState } from "react";
import { GeneratorForm, GeneratorConfig } from "@/components/GeneratorForm";
import { OutputCard } from "@/components/OutputCard";
import { FileText, Image, Code2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedContent {
  text?: string;
  imagePrompt?: string;
  imageUrl?: string;
  code?: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = async (config: GeneratorConfig) => {
    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const content: GeneratedContent = {};

      // Generate based on selected mode
      if (config.mode === "text") {
        const { data, error } = await supabase.functions.invoke('generate-text', {
          body: { 
            prompt: config.prompt,
            textType: config.textType,
            tone: config.tone,
            length: config.length
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data?.text) {
          content.text = data.text;
        }
      } else if (config.mode === "image") {
        content.imagePrompt = config.prompt;
        
        // Call edge function to generate image
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { 
            prompt: config.prompt,
            style: config.imageStyle 
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data?.imageUrl) {
          content.imageUrl = data.imageUrl;
        }
      } else if (config.mode === "code") {
        const { data, error } = await supabase.functions.invoke('generate-text', {
          body: { 
            prompt: `Generate a ${config.codeLanguage || 'JavaScript'} code snippet for: ${config.prompt}. Only return the code, no explanations.`,
            textType: 'code',
            tone: 'professional',
            length: 'medium'
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data?.text) {
          content.code = data.text;
        }
      }

      setGeneratedContent(content);
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            AI Multi-Modal Generator
          </h1>
          <p className="text-foreground mt-2">
            Generate text, images, and code from your prompts.
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
                <>
                  <OutputCard
                    title="Image Prompt"
                    description="Ready for AI image generators"
                    content={generatedContent.imagePrompt}
                    icon={<Image className="h-5 w-5" />}
                  />
                  {generatedContent.imageUrl && (
                    <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Image className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Generated Image</h3>
                          <p className="text-sm text-muted-foreground">AI-generated from your prompt</p>
                        </div>
                      </div>
                      <img 
                        src={generatedContent.imageUrl} 
                        alt="AI generated" 
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </>
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


export default Index;
