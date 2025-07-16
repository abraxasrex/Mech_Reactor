import React, { useEffect, useState, memo, useMemo } from 'react';
import { MechPart, PartCategory } from '../../models/MechPart';
import { usePartPositions } from '../../hooks/usePartPositions';
import PartCategoryUI from '../shared/PartCategoryUI';




interface MechDisplayProps {
  mechParts: MechPart[];
  selectedParts: Record<PartCategory, number>;
  onPreviousPart: (category: PartCategory) => void;
 // onPreviousPart_V2: (category: PartCategory) => void;
  onNextPart: (category: PartCategory) => void;
}

const MechDisplayComponent: React.FC<MechDisplayProps> = ({ 
  mechParts, 
  selectedParts, 
  onPreviousPart, 
  onNextPart 
}) => {
  
  // Define the display size and classes for the mech visualization
  const mechDisplaySize = "full";
  const partDisplayClasses = `absolute object-cover`;
  const parentColumnSetting = "grid-cols-12";
  const UIColumnSetting = "col-span-5";
  const partDisplayColumnSetting = "col-span-7";

      console.log('mechdisplay initialized');


  const getPartsByCategory = (category: PartCategory): MechPart[] => {
    return mechParts.filter(part => part.partCategory === category);
  };

  const getCurrentPart = (category: PartCategory): MechPart => {
    const categoryParts = getPartsByCategory(category);
    return categoryParts[selectedParts[category]];
  };

  const { partPositions } = usePartPositions({mechParts, selectedParts, getCurrentPart});

  return (
    <div className="p-8">
      <div className={`w-full max-w-7xl grid ${parentColumnSetting} gap-8`}>
        <div className={`grid ${UIColumnSetting} gap-6`}>
          {Object.values(PartCategory).map((category) => (
            <PartCategoryUI
              key={category}
              category={category}
              currentPart={getCurrentPart(category)}
              onPrevious={() => onPreviousPart(category)}
              onNext={() => onNextPart(category)}
            />
          ))}
        </div>

        <div className={`grid ${partDisplayColumnSetting} mech-visualization relative w-${mechDisplaySize} h-${mechDisplaySize} mx-auto top-[-10rem]`}>
          {getCurrentPart(PartCategory.Arms) && (
            <>
              <img 
                src={getCurrentPart(PartCategory.Arms)?.leftImageSource} 
                alt={`${getCurrentPart(PartCategory.Arms)?.readableName} Left`} 
                className={partDisplayClasses}
                style={{
                  transform: `translate(${partPositions[PartCategory.Arms].x}px, ${partPositions[PartCategory.Arms].y}px)`,
                  userSelect: 'none',
                  zIndex: 1
                }}
              />
            </>
          )}
          {getCurrentPart(PartCategory.Legs) && (
            <>
              <img 
                src={getCurrentPart(PartCategory.Legs)?.leftImageSource} 
                alt={`${getCurrentPart(PartCategory.Legs)?.readableName} Left`} 
                className={partDisplayClasses}
                style={{
                  transform: `translate(${partPositions[PartCategory.Legs].x}px, ${partPositions[PartCategory.Legs].y}px)`,
                  userSelect: 'none',
                  zIndex: 2
                }}
              />
            </>
          )}
          {getCurrentPart(PartCategory.Chassis) && (
            <img 
              src={getCurrentPart(PartCategory.Chassis)?.imageSource} 
              alt={getCurrentPart(PartCategory.Chassis)?.readableName} 
              className={partDisplayClasses}
              style={{
                transform: `translate(${partPositions[PartCategory.Chassis].x}px, ${partPositions[PartCategory.Chassis].y}px)`,
                userSelect: 'none',
                zIndex: 3
              }}
            />
          )}
          {getCurrentPart(PartCategory.Head) && (
            <img 
              src={getCurrentPart(PartCategory.Head)?.imageSource} 
              alt={getCurrentPart(PartCategory.Head)?.readableName} 
              className={partDisplayClasses}
              style={{
                transform: `translate(${partPositions[PartCategory.Head].x}px, ${partPositions[PartCategory.Head].y}px)`,
                userSelect: 'none',
                zIndex: 4
              }}
            />
          )}
          {getCurrentPart(PartCategory.Legs) && (
            <>
              <img 
                src={getCurrentPart(PartCategory.Legs)?.rightImageSource} 
                alt={`${getCurrentPart(PartCategory.Legs)?.readableName} Right`} 
                className={partDisplayClasses}
                style={{
                  transform: `translate(${partPositions[PartCategory.Legs].x}px, ${partPositions[PartCategory.Legs].y}px)`,
                  userSelect: 'none',
                  zIndex: 5
                }}
              />
            </>
          )}
          {getCurrentPart(PartCategory.Arms) && (
            <>
              <img 
                src={getCurrentPart(PartCategory.Arms)?.rightImageSource} 
                alt={`${getCurrentPart(PartCategory.Arms)?.readableName} Right`} 
                className={partDisplayClasses}
                style={{
                  transform: `translate(${partPositions[PartCategory.Arms].x}px, ${partPositions[PartCategory.Arms].y}px)`,
                  userSelect: 'none',
                  zIndex: 6
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

//export default MechDisplay;
export const MechDisplay = memo(MechDisplayComponent);