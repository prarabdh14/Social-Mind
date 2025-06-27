 
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { 
  Wand2, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin,
  Copy,
  Calendar,
  Hash,
  Sparkles,
  TrendingUp,
  BookmarkPlus,
  RefreshCw
} from "lucide-react";

export default function ContentStudio() {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentIdea, setContentIdea] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  ];

  const toneOptions = [
    { id: "professional", name: "Professional" },
    { id: "casual", name: "Casual" },
    { id: "witty", name: "Witty" },
    { id: "inspiring", name: "Inspiring" }
  ];

  const contentTemplates = [
    { id: 1, name: "Product Announcement", category: "Marketing", engagement: "High" },
    { id: 2, name: "Behind the Scenes", category: "Storytelling", engagement: "Medium" },
    { id: 3, name: "Tips & Tricks", category: "Educational", engagement: "High" },
    { id: 4, name: "User Generated Content", category: "Community", engagement: "Very High" },
    { id: 5, name: "Industry News", category: "News", engagement: "Medium" },
    { id: 6, name: "Question Post", category: "Engagement", engagement: "High" },
  ];

  const trendingTopics = [
    "#AI", "#SocialMedia", "#ContentCreation", "#DigitalMarketing", 
    "#Technology", "#Innovation", "#Automation", "#Engagement",
    "#SaaS", "#Productivity", "#Growth", "#Analytics"
  ];

  const generatedIdeas = [
    "Share a behind-the-scenes look at your AI content creation process",
    "Create a poll asking your audience about their biggest social media challenges",
    "Post a carousel explaining the benefits of AI-powered social media management",
    "Share a success story from a customer who increased engagement by 300%"
  ];

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const sampleContent = `🚀 Exciting news! Our AI-powered social media management platform is revolutionizing how businesses connect with their audience.

✨ Key features:
• Intelligent content generation
• Optimal posting schedules  
• Real-time analytics
• Multi-platform management

Ready to transform your social media strategy? Let's chat! 💬

#AI #SocialMedia #Innovation #DigitalMarketing`;
      
      setGeneratedContent(sampleContent);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Studio</h1>
          <p className="text-gray-600 mt-1">Create engaging content with AI assistance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Generation Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Content Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-blue-600" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platform Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Platform
                </label>
                <div className="flex gap-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <Button
                        key={platform.id}
                        variant={selectedPlatform === platform.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPlatform(platform.id)}
                        className="flex items-center gap-2"
                      >
                        <Icon className={`h-4 w-4 ${platform.color}`} />
                        {platform.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Content Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Describe your content idea
                </label>
                <Textarea
                  placeholder="e.g., Announce our new AI feature that helps users save 3 hours per week on content creation..."
                  className="h-24"
                  value={contentIdea}
                  onChange={(e) => setContentIdea(e.target.value)}
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Content Tone
                </label>
                <div className="flex gap-2">
                  {toneOptions.map((tone) => (
                    <Button
                      key={tone.id}
                      variant={selectedTone === tone.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTone(tone.id)}
                    >
                      {tone.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate AI Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content Preview */}
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[150px] bg-white"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save to Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Ideas Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                AI Content Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedIdeas.map((idea, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <p className="text-sm">{idea}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Use This Idea</Button>
                      <Button size="sm" variant="ghost">
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate More Ideas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Content Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-gray-500">{template.category}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.engagement}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Trending Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((hashtag) => (
                  <Badge
                    key={hashtag}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  >
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-white rounded border border-blue-100">
                  <p className="font-medium text-blue-900">Best Time to Post</p>
                  <p className="text-blue-700 text-xs">Today: 2:30 PM - 4:00 PM</p>
                </div>
                <div className="p-2 bg-white rounded border border-blue-100">
                  <p className="font-medium text-blue-900">Engagement Tip</p>
                  <p className="text-blue-700 text-xs">Add emojis for 15% more engagement</p>
                </div>
                <div className="p-2 bg-white rounded border border-blue-100">
                  <p className="font-medium text-blue-900">Trending Topic</p>
                  <p className="text-blue-700 text-xs">#AI is trending in your niche</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
