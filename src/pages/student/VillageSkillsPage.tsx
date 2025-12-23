import { SubjectLayout } from "@/components/student/SubjectLayout";
import { GameMissionCard } from "@/components/student/GameMissionCard";
import { VillageSkillsActiveLearning } from "@/components/active-learning/VillageSkillsActiveLearning";
import { TreePine, Droplets, Wheat, Hammer, Heart, Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const villageSkillsMissions = [
  {
    title: "Water Conservation",
    description: "Learn techniques to save and manage water in your village",
    icon: Droplets,
    reward: 100,
    difficulty: "medium" as const,
    status: "in-progress" as const,
    progress: 25,
  },
  {
    title: "Sustainable Farming",
    description: "Discover organic farming and soil health practices",
    icon: Wheat,
    reward: 90,
    difficulty: "medium" as const,
    status: "available" as const,
  },
  {
    title: "Basic Repairs",
    description: "Learn to fix common household items and save money",
    icon: Hammer,
    reward: 80,
    difficulty: "easy" as const,
    status: "available" as const,
  },
  {
    title: "First Aid Basics",
    description: "Essential first aid skills for emergencies",
    icon: Heart,
    reward: 110,
    difficulty: "medium" as const,
    status: "available" as const,
  },
  {
    title: "Waste Management",
    description: "Learn composting and recycling for a cleaner village",
    icon: Recycle,
    reward: 95,
    difficulty: "easy" as const,
    status: "available" as const,
  },
];

export default function VillageSkillsPage() {
  const navigate = useNavigate();

  return (
    <SubjectLayout
      title="Village & Life Skills"
      icon={TreePine}
      iconColor="text-secondary"
      progress={10}
      totalLessons={10}
      completedLessons={1}
      xpEarned={75}
    >
      <div className="slide-up" style={{ animationDelay: "150ms" }}>
        <div className="mb-4 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
          <p className="text-sm">
            🌱 Complete village tasks to earn bonus PlayCoins and help your community!
          </p>
        </div>
        <h3 className="mb-4 font-heading font-semibold">Missions & Games</h3>
        <div className="space-y-3">
          {villageSkillsMissions.map((mission, index) => (
            <div
              key={mission.title}
              className="slide-up"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <GameMissionCard {...mission} />
            </div>
          ))}
        </div>
      </div>
    </SubjectLayout>
  );
}
