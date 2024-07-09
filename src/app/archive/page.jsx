import { ArchiveHero } from "@/components/archive";

export const metadata = {
  title: "Thư Viện",
};

function Archive() {
  return (
    <div className="archive-route">
      <ArchiveHero />
    </div>
  );
}

export default Archive;
