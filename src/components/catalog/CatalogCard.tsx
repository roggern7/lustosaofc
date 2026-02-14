import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/hooks/useCatalog";

interface CatalogCardProps {
  product: Product;
  index: number;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";
const WHATSAPP_NUMBER = "5589994651266";

const parseSizes = (sizes: string | undefined): string[] => {
  if (!sizes || sizes.trim() === "") return [];
  return sizes.split(",").map((s) => s.trim()).filter((s) => s !== "");
};

export const CatalogCard = ({ product, index }: CatalogCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null);

  const sizes = parseSizes(product.variacoes);
  const hasSizes = sizes.length > 0;
  const isButtonEnabled = !hasSizes || selectedSize !== null;

  const imageUrl = product.image_url && product.image_url.trim() !== ""
    ? product.image_url
    : PLACEHOLDER_IMAGE;

  // Build array of all images (main + extras)
  const allImages = [imageUrl, ...(product.extra_images || [])].filter(Boolean);
  const hasMultipleImages = allImages.length > 1;

  const handleSizeSelect = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
    }
  };

  const handleWhatsApp = () => {
    if (hasSizes && !selectedSize) return;

    const sizeText = selectedSize ? ` - Tamanho ${selectedSize}` : "";
    const message = `Tenho interesse no produto ${product.nome}${sizeText}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }

    touchStartX.current = null;
  };

  // Mouse handlers for drag on desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - e.clientX;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }

    touchStartX.current = null;
  };

  return (
    <div
      className="group bg-card rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-border/50 hover:scale-[1.01] hover:shadow-2xl transition-all duration-200 active:scale-[0.99]"
      style={{ animationDelay: `${index * 50}ms`, animation: "fade-in 300ms ease-out forwards" }}
    >
      <Dialog onOpenChange={() => setCurrentImageIndex(0)}>
        <DialogTrigger asChild>
          <div className="aspect-[4/3] overflow-hidden rounded-t-xl sm:rounded-t-2xl cursor-pointer relative">
            <img
              src={imageError ? PLACEHOLDER_IMAGE : imageUrl}
              alt={`Foto do produto ${product.nome}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <Badge variant="secondary" className="absolute top-2 left-2 text-xs bg-background/80 backdrop-blur-sm text-black">
              {product.categoria}
            </Badge>
            {hasMultipleImages && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                +{allImages.length - 1} fotos
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl w-full p-0 overflow-hidden rounded-xl sm:rounded-2xl bg-black">
          <VisuallyHidden>
            <DialogTitle>{product.nome}</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            {/* Simple Image Display with swipe support */}
            <div
              className="relative aspect-square sm:aspect-[4/3] bg-black overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { touchStartX.current = null; }}
            >
              <img
                src={allImages[currentImageIndex] || PLACEHOLDER_IMAGE}
                alt={`Foto ${currentImageIndex + 1} do produto ${product.nome}`}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-black/50 hover:bg-black/70 active:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-black/50 hover:bg-black/70 active:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {hasMultipleImages && (
                <div className="absolute top-4 right-4 z-10 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}

              {/* Dot Indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`h-2 rounded-full ${
                        idx === currentImageIndex
                          ? 'bg-white w-6'
                          : 'bg-white/50 hover:bg-white/80 w-2'
                      }`}
                      aria-label={`Ver imagem ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 pt-16">
              <Badge className="mb-2">{product.categoria}</Badge>
              <h3 className="text-white text-base sm:text-xl font-semibold">{product.nome}</h3>
              {product.preco && <p className="text-white/90 text-sm sm:text-lg font-bold">R$ {product.preco.toFixed(2)}</p>}
              {product.descricao && <p className="text-white/70 text-xs sm:text-sm mt-1">{product.descricao}</p>}
              {product.variacoes && <p className="text-white/60 text-xs sm:text-sm mt-1">Tamanhos: {product.variacoes}</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground line-clamp-2 mb-2" title={product.nome}>
          {product.nome}
        </h3>
        {product.preco && <p className="text-primary font-bold text-sm sm:text-base mb-1">R$ {product.preco.toFixed(2)}</p>}
        {product.descricao && (
          <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{product.descricao}</p>
        )}

        {hasSizes && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Tamanho:</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`size-btn px-3 py-1.5 text-xs font-medium rounded-md border-2 transition-all duration-300 min-w-[36px]
                    ${selectedSize === size
                      ? 'bg-[#ffd740] border-black text-black shadow-md'
                      : 'bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-primary/50'
                    }`}
                  data-size={size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleWhatsApp}
          disabled={!isButtonEnabled}
          className={`buy-btn w-full py-3 rounded-lg text-lg font-bold border-none transition-all duration-300 min-h-[48px]
            ${isButtonEnabled
              ? 'bg-[#14a44d] text-white cursor-pointer hover:bg-[#128a41]'
              : 'bg-[#bfbfbf] text-white cursor-not-allowed'
            }`}
        >
          {hasSizes && !selectedSize ? 'SELECIONE UM TAMANHO' : 'COMPRAR'}
        </button>
      </div>
    </div>
  );
};
