import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState({
    niche: "",
    brandVoice: "",
    contentStyle: ""
  });

  const platforms = [
    { name: "Instagram", icon: Instagram, color: "text-pink-600", connected: false },
    { name: "Twitter", icon: Twitter, color: "text-blue-500", connected: false },
    { name: "Facebook", icon: Facebook, color: "text-blue-700", connected: false },
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-600", connected: false },
    { name: "YouTube", icon: Youtube, color: "text-red-600", connected: false },
  ];

  const handleConnectPlatform = (platformName: string) => {
    if (connectedPlatforms.includes(platformName)) {
      setConnectedPlatforms(connectedPlatforms.filter(p => p !== platformName));
    } else {
      setConnectedPlatforms([...connectedPlatforms, platformName]);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard/schedule-setup");
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold">SocialMind Setup</h1>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-gray-600 mt-2">Step {currentStep} of 3</p>
        </div>

        {/* Step 1: Platform Selection */}
        {currentStep === 1 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Connect Your Social Platforms</CardTitle>
              <p className="text-gray-600">Choose which platforms you want to manage with SocialMind</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isConnected = connectedPlatforms.includes(platform.name);
                  return (
                    <Card
                      key={platform.name}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                        isConnected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleConnectPlatform(platform.name)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="relative">
                          <Icon className={`h-12 w-12 mx-auto mb-3 ${platform.color}`} />
                          {isConnected && (
                            <CheckCircle className="h-6 w-6 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                          )}
                        </div>
                        <h3 className="font-semibold mb-2">{platform.name}</h3>
                        <Button
                          variant={isConnected ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                        >
                          {isConnected ? "Connected" : "Connect"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Profile Setup */}
        {currentStep === 2 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Tell Us About Your Brand</CardTitle>
              <p className="text-gray-600">Help our AI understand your content style and preferences</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="niche">What's your niche or industry?</Label>
                <Input
                  id="niche"
                  placeholder="e.g., Fashion, Tech, Food, Travel"
                  value={userProfile.niche}
                  onChange={(e) => setUserProfile({...userProfile, niche: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="brandVoice">Describe your brand voice</Label>
                <Input
                  id="brandVoice"
                  placeholder="e.g., Professional, Casual, Witty, Inspirational"
                  value={userProfile.brandVoice}
                  onChange={(e) => setUserProfile({...userProfile, brandVoice: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contentStyle">What type of content do you create?</Label>
                <Input
                  id="contentStyle"
                  placeholder="e.g., Educational, Entertainment, Product showcases"
                  value={userProfile.contentStyle}
                  onChange={(e) => setUserProfile({...userProfile, contentStyle: e.target.value})}
                />
              </div>
              {userProfile.niche && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">AI Preview</h4>
                  <p className="text-sm text-gray-600">
                    Based on your inputs, our AI will create {userProfile.brandVoice.toLowerCase()} content 
                    for the {userProfile.niche.toLowerCase()} industry, focusing on {userProfile.contentStyle.toLowerCase()}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">You're All Set!</CardTitle>
              <p className="text-gray-600">Review your setup and let's get started</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Connected Platforms</h3>
                  <div className="space-y-2">
                    {connectedPlatforms.map((platform) => (
                      <div key={platform} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Brand Profile</h3>
                  <div className="space-y-2">
                    <Badge variant="outline">{userProfile.niche}</Badge>
                    <Badge variant="outline">{userProfile.brandVoice}</Badge>
                    <Badge variant="outline">{userProfile.contentStyle}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === 1 && connectedPlatforms.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === 3 ? "Complete Setup" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 