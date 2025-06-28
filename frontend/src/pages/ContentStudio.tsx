import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { API_URL } from "../config";
import { postService } from "../services/api";
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
  RefreshCw,
  Upload,
  CheckCircle,
  Loader2,
  Save,
  Clock,
  Youtube,
  MessageCircle
} from "lucide-react";

export default function ContentStudio() {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentIdea, setContentIdea] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [file, setFile] = useState<File | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600" },
    { id: "threads", name: "Threads", icon: MessageCircle, color: "text-black" },
  ];

  const toneOptions = [
    { id: "professional", name: "Professional" },
    { id: "casual", name: "Casual" },
    { id: "witty", name: "Witty" },
    { id: "inspiring", name: "Inspiring" },
    { id: "humorous", name: "Humorous" },
    { id: "educational", name: "Educational" }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAiError(null);
    }
  };

  const handleGenerateContent = async () => {
    if (!file) {
      setAiError('Please upload a photo or video first');
      return;
    }

    setIsGenerating(true);
    setAiError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tone', selectedTone);
      formData.append('platform', selectedPlatform);
      formData.append('contentIdea', contentIdea);
      
      const res = await fetch(`${API_URL}/ai/caption`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Failed to generate caption');
      
      const data = await res.json();
      setGeneratedContent(data.caption);
    } catch (err) {
      setAiError('Failed to generate caption. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content');
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedContent.trim()) return;
    
    setSaving(true);
    try {
      await postService.createPost({
        content: generatedContent,
        platform: selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1),
        status: 'DRAFT',
        scheduledAt: new Date().toISOString()
      });
      
      // Show success feedback
      setGeneratedContent("");
      setFile(null);
    } catch (err) {
      setAiError('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!generatedContent.trim() || !scheduledDate || !scheduledTime) {
      setAiError('Please fill in all required fields');
      return;
    }
    
    setScheduling(true);
    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      await postService.createPost({
        content: generatedContent,
        platform: selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1),
        status: 'SCHEDULED',
        scheduledAt: scheduledDateTime.toISOString()
      });
      
      // Show success feedback
      setGeneratedContent("");
      setFile(null);
      setScheduledDate("");
      setScheduledTime("");
    } catch (err) {
      setAiError('Failed to schedule post');
    } finally {
      setScheduling(false);
    }
  };

  const handleTemplateClick = (template: any) => {
    setContentIdea(`Create a ${template.name.toLowerCase()} post about ${template.category.toLowerCase()}`);
  };

  const handleTopicClick = (topic: string) => {
    if (generatedContent) {
      setGeneratedContent(prev => prev + ' ' + topic);
    } else {
      setContentIdea(`Create content about ${topic}`);
    }
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
              {/* File Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Upload Photo/Video for AI Captioning
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, MP4 up to 10MB</p>
                </div>
                {file && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Selected: {file.name}
                  </div>
                )}
                {aiError && (
                  <div className="mt-2 text-sm text-red-600">
                    {aiError}
                  </div>
                )}
              </div>

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
                  Content Idea (Optional)
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
                disabled={isGenerating || !file}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating AI Caption...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Caption
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
                    placeholder="Generated content will appear here..."
                  />
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyContent}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSaveDraft}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </>
                    )}
                  </Button>
                </div>

                {/* Schedule Post Section */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Schedule Post</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label htmlFor="schedule-date">Date</Label>
                      <Input
                        id="schedule-date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="schedule-time">Time</Label>
                      <Input
                        id="schedule-time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleSchedulePost}
                    disabled={scheduling || !scheduledDate || !scheduledTime}
                  >
                    {scheduling ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Post
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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
                    onClick={() => handleTemplateClick(template)}
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

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Content Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedIdeas.map((idea, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setContentIdea(idea)}
                  >
                    <p className="text-sm text-blue-900">{idea}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
