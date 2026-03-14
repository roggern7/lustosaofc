import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SizeFilterProps {
  selectedSize: string | null;
  onSizeSelect: (size: string | null) => void;
}

const SIZES = ["35", "36", "37", "38", "38.5", "39", "39.5", "40", "40.5", "41", "42", "43", "44"];

export const SizeFilter = ({ selectedSize, onSizeSelect }: SizeFilterProps) => {
  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg ring-1 ring-border/50">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Filtrar por Numeração</h3>
        {selectedSize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSizeSelect(null)}
            className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground min-h-[40px] px-2 sm:px-3"
          >
            <X className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Limpar</span>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pb-2 sm:pb-0">
        {SIZES.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSizeSelect(selectedSize === size ? null : size)}
            className="font-medium transition-all duration-200 active:scale-95 sm:hover:scale-105 min-h-[44px] min-w-[44px] px-3 whitespace-nowrap flex-shrink-0 text-sm"
          >
            {size}
          </Button>
        ))}
      </div>

      {selectedSize && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Filtrando por:</span>
          <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm py-1">
            Nº {selectedSize}
            <button
              onClick={() => onSizeSelect(null)}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors min-w-[20px] min-h-[20px] flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
};
