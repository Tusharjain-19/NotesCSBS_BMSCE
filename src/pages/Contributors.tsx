import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Users } from "lucide-react";

interface Contributor {
  name: string;
  linkedIn: string;
  batch: string;
}

const contributors: Contributor[] = [
  {
    name: "Tushar Jain",
    linkedIn: "https://www.linkedin.com/in/tushar-jain-781149322/",
    batch: "2028",
  },
  {
    name: "Ayush Kumar",
    linkedIn: "https://www.linkedin.com/in/ayush-kumar-b903b7285/",
    batch: "2028",
  },
  {
    name: "Niranjan K",
    linkedIn: "https://www.linkedin.com/in/niranjan-k-140ba9322/",
    batch: "2028",
  },
  {
    name: "Rishabh Gupta",
    linkedIn: "https://www.linkedin.com/in/rishabh-gupta-4aa635387/",
    batch: "2028",
  },
];

const ContributorCard = ({ contributor }: { contributor: Contributor }) => (
  <Card className="group hover:shadow-soft-lg hover:scale-105 transition-all duration-300 border-border bg-gradient-to-br from-card to-accent/20">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {contributor.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Batch of {contributor.batch}
          </p>
        </div>
        <a
          href={contributor.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-pink-500/10 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 max-w-5xl pb-24">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Contributors" },
          ]}
        />

        {/* Header with Gradient */}
        <div className="mt-8 mb-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 via-teal-500/10 to-cyan-500/10 border border-green-200/20 dark:border-green-800/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Contributors</h1>
          </div>
          <p className="text-muted-foreground">
            Meet the amazing students who built and maintain this platform
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {contributors.map((contributor) => (
            <ContributorCard key={contributor.name} contributor={contributor} />
          ))}
        </div>

        {/* Thank You Note */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            💙 Thank you for using Notes CSBS! Built with love for BMSCE students.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
