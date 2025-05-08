import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { MechPartService } from './services/MechPartService';
import { MechPart, PartCategory } from './models/MechPart';
import Layout from './components/Layout';
import PartArrangementEditor from './components/PartArrangementEditor';
import PartCategoryUI from './components/PartCategoryUI';
import { usePartPositions } from './hooks/usePartPositions';

interface MechDisplayProps {
  mechParts: MechPart[];
  selectedParts: Record<PartCategory, number>;
  onPreviousPart: (category: PartCategory) => void;
  onNextPart: (category: PartCategory) => void;
}

const MechDisplay: React.FC<MechDisplayProps> = ({ 
  mechParts, 
  selectedParts, 
  onPreviousPart, 
  onNextPart 
}) => {
  const mechDisplaySize = "full";
  const partDisplayClasses = `absolute object-cover`;
  const parentColumnSetting = "grid-cols-12";
  const UIColumnSetting = "col-span-5";
  const partDisplayColumnSetting = "col-span-7";

  const getPartsByCategory = (category: PartCategory): MechPart[] => {
    return mechParts.filter(part => part.partCategory === category);
  };

  const getCurrentPart = (category: PartCategory): MechPart => {
    const categoryParts = getPartsByCategory(category);
    return categoryParts[selectedParts[category]];
  };

  const { partPositions } = usePartPositions({
    mechParts,
    selectedParts,
    getCurrentPart
  });

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
                  userSelect: 'none'
                }}
              />
              <img 
                src={getCurrentPart(PartCategory.Arms)?.rightImageSource} 
                alt={`${getCurrentPart(PartCategory.Arms)?.readableName} Right`} 
                className={partDisplayClasses}
                style={{
                  transform: `translate(${partPositions[PartCategory.Arms].x}px, ${partPositions[PartCategory.Arms].y}px)`,
                  userSelect: 'none'
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
                  userSelect: 'none'
                }}
              />
              <img 
                src={getCurrentPart(PartCategory.Legs)?.rightImageSource} 
                alt={`${getCurrentPart(PartCategory.Legs)?.readableName} Right`} 
                className={partDisplayClasses}
                style={{
                  transform: `translate(${partPositions[PartCategory.Legs].x}px, ${partPositions[PartCategory.Legs].y}px)`,
                  userSelect: 'none'
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
                userSelect: 'none'
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
                userSelect: 'none'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mechParts, setMechParts] = useState<MechPart[]>([]);
  const [selectedParts, setSelectedParts] = useState<Record<PartCategory, number>>({
    [PartCategory.Head]: 0,
    [PartCategory.Chassis]: 0,
    [PartCategory.Arms]: 0,
    [PartCategory.Legs]: 0,
  });

  useEffect(() => {
    const loadMechParts = async () => {
      try {
        const parts = await MechPartService.loadMechParts();
        setMechParts(parts);
      } catch (error) {
        console.error("Error loading mech parts:", error);
      }
    };
    loadMechParts();
  }, []);

  const handlePrevious = (category: PartCategory) => {
    setSelectedParts(prev => {
      const categoryParts = mechParts.filter(part => part.partCategory === category);
      const newIndex = (prev[category] - 1 + categoryParts.length) % categoryParts.length;
      return { ...prev, [category]: newIndex };
    });
  };

  const handleNext = (category: PartCategory) => {
    setSelectedParts(prev => {
      const categoryParts = mechParts.filter(part => part.partCategory === category);
      const newIndex = (prev[category] + 1) % categoryParts.length;
      return { ...prev, [category]: newIndex };
    });
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <MechDisplay 
            mechParts={mechParts}
            selectedParts={selectedParts}
            onPreviousPart={handlePrevious}
            onNextPart={handleNext}
          />
        } />
        <Route 
          path="editor" 
          element={
            <PartArrangementEditor 
              mechParts={mechParts}
              selectedParts={selectedParts}
            />
          } 
        />
      </Route>
    </Routes>
  );
};

export default App;
