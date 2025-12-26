import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";

interface Contributor {
  name: string;
  linkedIn: string;
  batch: string;
  branch: string;
}

const contributors: Contributor[] = [
  {
    name: "Tushar Jain",
    linkedIn: "https://www.linkedin.com/in/tushar-jain-781149322/",
    batch: "2028",
    branch: "CSBS",
  },
  {
    name: "Ayush Kumar",
    linkedIn: "https://www.linkedin.com/in/ayush-kumar-b903b7285/",
    batch: "2028",
    branch: "CSBS",
  },
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contributors.map((contributor) => (
              <Card key={contributor.name} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {contributor.name}
                      </h3>
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
