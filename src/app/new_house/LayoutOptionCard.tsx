import Image from 'next/image';
import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/components/card';
import { LayoutOption } from './layout-service';

interface LayoutOptionCardProps {
  option: LayoutOption;
  layoutId: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function LayoutOptionCard({ option, layoutId, isSelected = false, onClick }: LayoutOptionCardProps) {
  return (
    <Card
      variant={isSelected ? "primary" : "default"}
      data-layout-id={layoutId}
      className="cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-24 overflow-hidden">
            <Image
              src={option.floorplanPicture}
              alt={`${option.name} floor plan`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 128px"
            />
          </div>
        </div>
        <CardTitle>{option.name}</CardTitle>
        <CardDescription className="space-y-2">
          <p>{option.description}</p>
          <div className="text-sm text-gray-500">
            <p>{option.roomCount} rooms</p>
            <p className="text-xs">{option.features.join(' • ')}</p>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}