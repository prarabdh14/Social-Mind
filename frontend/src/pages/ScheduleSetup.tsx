import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Calendar,
  Clock,
  Zap,
  ArrowRight,
  Instagram,
  Twitter,
  Facebook
} from "lucide-react";

export default function ScheduleSetup() {
  const navigate = useNavigate();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [autoReminders, setAutoReminders] = useState(true);
  const [aiOptimization, setAiOptimization] = useState(true);

  const timeSlots = [
    { time: "9:00 AM", platform: "instagram", engagement: "High" },
    { time: "12:00 PM", platform: "twitter", engagement: "Medium" },
    { time: "3:00 PM", platform: "instagram", engagement: "High" },
    { time: "6:00 PM", platform: "facebook", engagement: "High" },
    { time: "8:00 PM", platform: "twitter", engagement: "Medium" },
  ];

  const platforms = {
    instagram: { icon: Instagram, color: "text-pink-600" },
    twitter: { icon: Twitter, color: "text-blue-500" },
    facebook: { icon: Facebook, color: "text-blue-700" }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set Your Posting Schedule</h1>
          <p className="text-gray-600">Configure when and how often you want to post</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Schedule Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Optimal Posting Times
              </CardTitle>
              <p className="text-sm text-gray-600">AI-recommended times based on your audience</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {timeSlots.map((slot) => {
                const PlatformIcon = platforms[slot.platform as keyof typeof platforms].icon;
                const isSelected = selectedTimes.includes(slot.time);
                return (
                  <div
                    key={slot.time}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PlatformIcon className={`h-5 w-5 ${platforms[slot.platform as keyof typeof platforms].color}`} />
                        <div>
                          <div className="font-medium">{slot.time}</div>
                          <div className="text-sm text-gray-500">Best for {slot.platform}</div>
                        </div>
                      </div>
                      <Badge variant={slot.engagement === "High" ? "default" : "secondary"}>
                        {slot.engagement} engagement
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-optimization">Smart Scheduling</Label>
                    <p className="text-sm text-gray-600">Let AI adjust timing for maximum engagement</p>
                  </div>
                  <Switch
                    id="ai-optimization"
                    checked={aiOptimization}
                    onCheckedChange={setAiOptimization}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reminders">Upload Reminders</Label>
                    <p className="text-sm text-gray-600">Get notified when it's time to post</p>
                  </div>
                  <Switch
                    id="reminders"
                    checked={autoReminders}
                    onCheckedChange={setAutoReminders}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI Recommendation</h3>
                    <p className="text-sm text-gray-700">
                      Based on your selected platforms, posting 3-4 times per day during these optimal windows 
                      could increase your engagement by up to 40%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => navigate("/onboarding")}>
            Back
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
