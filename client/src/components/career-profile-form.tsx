import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export type CareerProfile = {
  currentRole: string;
  yearsExperience: string;
  background: string;
  skills: string;
  interests: string;
};

type CareerProfileFormProps = {
  onProfileSubmit: (profile: CareerProfile) => Promise<void>;
};

export function CareerProfileForm({ onProfileSubmit }: CareerProfileFormProps) {
  const [profile, setProfile] = useState<CareerProfile>({
    currentRole: "",
    yearsExperience: "",
    background: "",
    skills: "",
    interests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onProfileSubmit(profile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Explore AI Safety Career Paths</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Career Profile</DialogTitle>
          <DialogDescription>
            Share your background to get personalized AI safety career path suggestions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentRole">Current Role</Label>
            <Input
              id="currentRole"
              placeholder="e.g., Software Engineer, Policy Analyst"
              value={profile.currentRole}
              onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Input
              id="yearsExperience"
              placeholder="e.g., 3"
              value={profile.yearsExperience}
              onChange={(e) => setProfile({ ...profile, yearsExperience: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="background">Professional Background</Label>
            <Textarea
              id="background"
              placeholder="Describe your education and relevant work experience"
              value={profile.background}
              onChange={(e) => setProfile({ ...profile, background: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Key Skills</Label>
            <Textarea
              id="skills"
              placeholder="List your main technical and non-technical skills"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">AI Safety Interests</Label>
            <Textarea
              id="interests"
              placeholder="What aspects of AI safety interest you the most?"
              value={profile.interests}
              onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Career Suggestions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
