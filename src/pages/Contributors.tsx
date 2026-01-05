import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";

interface Contributor {
  name: string;
  linkedIn: string;
  batch: string;
  branch: string;
  role?: string;
}

const techContributors: Contributor[] = [
  {
    name: "Tushar Jain",
    linkedIn: "https://www.linkedin.com/in/tushar-jain-781149322/",
    batch: "2028",
    branch: "CSBS",
    role: "Tech Lead",
  },
  {
    name: "Ayush Kumar",
    linkedIn: "https://www.linkedin.com/in/ayush-kumar-b903b7285/",
    batch: "2028",
    branch: "CSBS",
    role: "Database Management",
  },
];

const resourceContributors: Contributor[] = [
  {
    name: "Niranjan K",
    linkedIn: "https://www.linkedin.com/in/niranjan-k-140ba9322/",
    batch: "2028",
    branch: "CSBS",
  },
  {
    name: "Rishabh Gupta",
    linkedIn: "https://www.linkedin.com/in/rishabh-gupta-4aa635387/",
    batch: "2028",
    branch: "CSBS",
  },
];

const ContributorCard = ({ contributor }: { contributor: Contributor }) => (
  <Card className="group hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            {contributor.name}
          </h3>
          {contributor.role && (
            <p className="text-sm text-primary font-medium">
              {contributor.role}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Batch of {contributor.batch} • {contributor.branch}
          </p>
        </div>
        <a
          href={contributor.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label={`${contributor.name}'s LinkedIn`}
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </CardContent>
  </Card>
);

export default function Contributors() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Contributors" },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Contributors</h1>
          <p className="text-muted-foreground mb-8">
            Meet the amazing people who contributed to this project.
          </p>

          {/* Tech Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Tech Team
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techContributors.map((contributor) => (
                <ContributorCard key={contributor.name} contributor={contributor} />
              ))}
            </div>
          </div>

          {/* Resource Contributors Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Resource Contributors
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resourceContributors.map((contributor) => (
                <ContributorCard key={contributor.name} contributor={contributor} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
