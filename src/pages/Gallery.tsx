import { useState, useMemo } from 'react';
import { X, ZoomIn, Filter, ChevronDown } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import { useGallery } from '@/hooks/useSupabaseData';
import { processImageUrl, handleImageError } from '@/lib/imageUtils';

const Gallery = () => {
  const { data: images, loading } = useGallery();
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');

  // Get unique years and events
  const years = useMemo(() => {
    const uniqueYears = [...new Set(images.map(img => img.year).filter(Boolean))];
    return uniqueYears.sort((a, b) => (b || '').localeCompare(a || ''));
  }, [images]);

  const events = useMemo(() => {
    const filteredImages = selectedYear === 'all' 
      ? images 
      : images.filter(img => img.year === selectedYear);
    const uniqueEvents = [...new Set(filteredImages.map(img => img.event_name).filter(Boolean))];
    return uniqueEvents.sort();
  }, [images, selectedYear]);

  // Filter images
  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const yearMatch = selectedYear === 'all' || img.year === selectedYear;
      const eventMatch = selectedEvent === 'all' || img.event_name === selectedEvent;
      return yearMatch && eventMatch;
    });
  }, [images, selectedYear, selectedEvent]);

  // Set default to latest year
  useMemo(() => {
    if (years.length > 0 && selectedYear === 'all') {
      // Keep 'all' as default, but latest year is available
    }
  }, [years]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navigation />
      <CollegeBrandingBar />

      {/* Hero */}
      <section className="pt-44 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
              <span className="gradient-text">Event Gallery</span>
            </h1>
            <p className="font-rajdhani text-lg text-muted-foreground opacity-0 animate-fade-in"
              style={{ animationDelay: '0.2s' }}>
              Relive the moments from our previous editions. The innovation, the energy, the memories.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Year Dropdown */}
            <div className="relative">
              <label className="flex items-center gap-2 font-rajdhani text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                Year:
              </label>
              <div className="relative mt-1">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedEvent('all');
                  }}
                  className="appearance-none px-4 py-2 pr-10 bg-muted/50 border border-border rounded-xl 
                    font-rajdhani text-foreground cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year || ''}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Event Filter Chips */}
            {events.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-rajdhani text-sm text-muted-foreground">Event:</span>
                <button
                  onClick={() => setSelectedEvent('all')}
                  className={`px-4 py-1.5 rounded-full font-rajdhani text-sm transition-all
                    ${selectedEvent === 'all' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  All Events
                </button>
                {events.map(event => (
                  <button
                    key={event}
                    onClick={() => setSelectedEvent(event || 'all')}
                    className={`px-4 py-1.5 rounded-full font-rajdhani text-sm transition-all
                      ${selectedEvent === event 
                        ? 'bg-primary text-primary-foreground neon-border' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="text-center mt-4">
            <span className="font-rajdhani text-sm text-muted-foreground">
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'} found
            </span>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer
                    opacity-0 animate-scale-in glass-card p-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={processImageUrl(image.image_url)}
                    alt={image.caption || 'Gallery image'}
                    className="w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                    style={{ height: `${200 + Math.random() * 200}px`, objectFit: 'cover' }}
                    onError={(e) => handleImageError(e, 'gallery')}
                    loading="lazy"
                  />
                  <div className="absolute inset-1 rounded-xl bg-gradient-to-t from-background via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="font-rajdhani font-medium text-foreground block">{image.caption}</span>
                        {(image.year || image.event_name) && (
                          <span className="font-rajdhani text-xs text-muted-foreground">
                            {[image.event_name, image.year].filter(Boolean).join(' • ')}
                          </span>
                        )}
                      </div>
                      <ZoomIn className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-rajdhani text-xl text-muted-foreground">
                {images.length === 0 ? 'Gallery coming soon!' : 'No images match your filters'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 glass-card rounded-full hover:bg-destructive/20 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}>
            <img
              src={processImageUrl(selectedImage.image_url)}
              alt={selectedImage.caption || 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl glass-card p-2"
              onError={(e) => handleImageError(e, 'gallery')}
            />
            <div className="text-center">
              {selectedImage.caption && (
                <p className="font-rajdhani text-lg text-foreground">{selectedImage.caption}</p>
              )}
              {(selectedImage.year || selectedImage.event_name) && (
                <p className="font-rajdhani text-sm text-muted-foreground mt-1">
                  {[selectedImage.event_name, selectedImage.year].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
