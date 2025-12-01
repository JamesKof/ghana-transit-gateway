import { useState, useEffect, useRef } from "react";
import { ScrollReveal, StaggerReveal } from "@/hooks/useScrollAnimation";
import { Camera, Users, Building2, Globe, Award, Heart, Briefcase, Shield, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageLightbox } from "@/components/ImageLightbox";

// Sample gallery images - these would typically come from a backend/API
const galleryCategories = [
  {
    id: "operations",
    name: "Operations",
    icon: Shield,
    images: [
      {
        id: 1,
        url: "https://gis.gov.gh/wp-content/uploads/2025/11/IMG-20251023-WA0043.jpg",
        title: "Immigration Operations",
        description: "GIS officers conducting immigration operations",
        category: "operations",
      },
      {
        id: 2,
        url: "https://gis.gov.gh/wp-content/uploads/2025/11/IMG-20251023-WA0039.jpg",
        title: "Field Operations",
        description: "Immigration service field operations",
        category: "operations",
      },
      {
        id: 3,
        url: "https://gis.gov.gh/wp-content/uploads/2025/11/IMG-20251023-WA0040.jpg",
        title: "Border Security",
        description: "Border control and security operations",
        category: "operations",
      },
      {
        id: 4,
        url: "https://gis.gov.gh/wp-content/uploads/2025/11/IMG-20251023-WA0041.jpg",
        title: "Service Delivery",
        description: "GIS officers providing immigration services",
        category: "operations",
      },
      {
        id: 5,
        url: "https://gis.gov.gh/wp-content/uploads/2025/11/IMG-20251023-WA0042.jpg",
        title: "Operations Coordination",
        description: "Coordination of immigration operations",
        category: "operations",
      },
    ],
  },
  {
    id: "training",
    name: "Training & Development",
    icon: Award,
    images: [
      {
        id: 6,
        url: "https://gis.gov.gh/wp-content/uploads/2019/10/Passing-Off-Parade.jpeg",
        title: "Passing Off Parade",
        description: "GIS recruits at the Passing Off Parade ceremony",
        category: "training",
      },
      {
        id: 7,
        url: "https://gis.gov.gh/wp-content/uploads/2019/10/Passing-Off-Parade3.jpeg",
        title: "Passing Off Parade - March",
        description: "Officers marching at the Passing Off Parade",
        category: "training",
      },
      {
        id: 8,
        url: "https://gis.gov.gh/wp-content/uploads/2019/10/Passing-Off-Parade2.jpeg",
        title: "Passing Off Parade - Inspection",
        description: "Inspection of officers at the Passing Off Parade",
        category: "training",
      },
      {
        id: 9,
        url: "https://gis.gov.gh/wp-content/uploads/2019/10/Passing-Off-Parade1.jpeg",
        title: "Passing Off Parade - Formation",
        description: "Officers in formation at the Passing Off Parade",
        category: "training",
      },
    ],
  },
  {
    id: "events",
    name: "Events & Ceremonies",
    icon: Users,
    images: [
      {
        id: 10,
        url: "https://gis.gov.gh/wp-content/uploads/2023/10/Strategic-Plan-Launch4.jpeg",
        title: "Strategic Plan Launch",
        description: "Launch of GIS Strategic Plan",
        category: "events",
      },
      {
        id: 11,
        url: "https://gis.gov.gh/wp-content/uploads/2023/10/Strategic-Plan-Launch3.jpeg",
        title: "Strategic Plan Presentation",
        description: "Presentation at the Strategic Plan Launch event",
        category: "events",
      },
      {
        id: 12,
        url: "https://gis.gov.gh/wp-content/uploads/2023/10/MMIGRATION-SERVICE-COMMISERATES-WITH-PRESIDENT-KUFUOR3.jpeg",
        title: "Presidential Engagement",
        description: "Ghana Immigration Service engagement with President Kufuor",
        category: "events",
      },
    ],
  },
  {
    id: "facilities",
    name: "Facilities & Infrastructure",
    icon: Building2,
    images: [
      {
        id: 13,
        url: "https://gis.gov.gh/wp-content/uploads/2023/10/about-us.jpeg",
        title: "GIS Headquarters",
        description: "Ghana Immigration Service Headquarters building",
        category: "facilities",
      },
    ],
  },
];

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayedCount, setDisplayedCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);

  const allImages =
    selectedCategory === "all"
      ? galleryCategories.flatMap((cat) => cat.images)
      : galleryCategories.find((cat) => cat.id === selectedCategory)?.images || [];

  const displayedImages = allImages.slice(0, displayedCount);
  const hasMore = displayedCount < allImages.length;

  // Reset displayed count when category changes
  useEffect(() => {
    setDisplayedCount(6);
  }, [selectedCategory]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, displayedCount]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + 6, allImages.length));
      setIsLoading(false);
    }, 800);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10" />
        <div className="container relative z-10 text-center text-white">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium">Photo Gallery</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              GIS Gallery
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Explore moments, operations, and achievements of the Ghana Immigration Service
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-background">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-card text-foreground border border-border hover:border-primary hover:shadow-md"
                }`}
              >
                <Camera className="w-4 h-4 inline-block mr-2" />
                All Photos
              </button>
              {galleryCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-card text-foreground border border-border hover:border-primary hover:shadow-md"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 inline-block mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className="group relative bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                {/* Placeholder Image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Camera className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* Overlay Info */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                    <p className="text-sm text-white/90">{image.description}</p>
                    <div className="mt-3 text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                      Click to view full size
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {image.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Indicator & Observer Target */}
          {hasMore && (
            <div ref={observerRef} className="flex justify-center items-center py-12">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading more images...</p>
                </div>
              ) : (
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                >
                  Load More Images
                </button>
              )}
            </div>
          )}

          {/* All Loaded Message */}
          {!hasMore && allImages.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                You've viewed all {allImages.length} images in this category
              </p>
            </div>
          )}

          {/* Empty State */}
          {allImages.length === 0 && (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No images found</h3>
              <p className="text-muted-foreground">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}

      {/* Call to Action */}
      <ScrollReveal animation="fade-up">
        <section className="section-padding bg-gradient-to-br from-primary via-primary/95 to-secondary text-white">
          <div className="container text-center">
            <Heart className="w-12 h-12 mx-auto mb-6 animate-pulse" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Stay Connected
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Follow us on social media for the latest updates, news, and more photos from GIS activities
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-white text-primary rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105">
                Follow on Facebook
              </button>
              <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105">
                Follow on Twitter
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
