import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import { useGallery } from '@/hooks/useSupabaseData';
import { processImageUrl, handleImageError } from '@/lib/imageUtils';

const Gallery = () => {
  const { data: images, loading } = useGallery();
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);

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

      {/* Masonry Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {images.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer
                    opacity-0 animate-scale-in glass-card p-1"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="font-rajdhani font-medium text-foreground">{image.caption}</span>
                    <ZoomIn className="w-5 h-5 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-rajdhani text-xl text-muted-foreground">Gallery coming soon!</p>
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
            {selectedImage.caption && (
              <p className="font-rajdhani text-lg text-muted-foreground">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
