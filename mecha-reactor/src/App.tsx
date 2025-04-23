import React, { useEffect, useState } from 'react';
import './App.css';
import { MechPartService } from './services/MechPartService';
import { MechPart, PartCategory } from './models/MechPart';
import PartCategoryUI from './components/PartCategoryUI';

const App: React.FC = () => {

  const mechDisplaySize = "full ";
  const partDisplayClasses = `absolute object-cover`;
  const parentColumnSetting = "grid-cols-12";
  const UIColumnSetting = "col-span-5";
  const partDisplayColumnSetting = "col-span-7";
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

  const getPartsByCategory = (category: PartCategory): MechPart[] => {
    return mechParts.filter(part => part.partCategory === category);
  };

  const getCurrentPart = (category: PartCategory): MechPart | undefined => {
    const categoryParts = getPartsByCategory(category);
    return categoryParts[selectedParts[category]];
  };

  const handlePrevious = (category: PartCategory) => {
    setSelectedParts(prev => {
      const categoryParts = getPartsByCategory(category);
      const newIndex = (prev[category] - 1 + categoryParts.length) % categoryParts.length;
      return { ...prev, [category]: newIndex };
    });
  };

  const handleNext = (category: PartCategory) => {
    setSelectedParts(prev => {
      const categoryParts = getPartsByCategory(category);
      const newIndex = (prev[category] + 1) % categoryParts.length;
      return { ...prev, [category]: newIndex };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Mecha Reactor</h1>
      
      <div className={`w-full max-w-7xl grid ${parentColumnSetting} gap-8`}>
        <div className={`grid ${UIColumnSetting} gap-6`}>
          {Object.values(PartCategory).map((category) => (
            <PartCategoryUI
              key={category}
              category={category}
              currentPart={getCurrentPart(category)}
              onPrevious={() => handlePrevious(category)}
              onNext={() => handleNext(category)}
            />
          ))}
        </div>

        <div className= {`grid ${partDisplayColumnSetting} mech-visualization relative w-${mechDisplaySize} h-${mechDisplaySize} mx-auto top-[-10rem]`}>
          {getCurrentPart(PartCategory.Arms) && (
            <img 
              src={getCurrentPart(PartCategory.Arms)?.leftImageSource} 
              alt={`${getCurrentPart(PartCategory.Arms)?.readableName} Left`} 
              className= {partDisplayClasses} 
            />
          )}
          {getCurrentPart(PartCategory.Legs) && (
            <img 
              src={getCurrentPart(PartCategory.Legs)?.leftImageSource} 
              alt={`${getCurrentPart(PartCategory.Legs)?.readableName} Left`} 
              className= {partDisplayClasses}
            />
          )}
          {getCurrentPart(PartCategory.Chassis) && (
            <img 
              src={getCurrentPart(PartCategory.Chassis)?.imageSource} 
              alt={getCurrentPart(PartCategory.Chassis)?.readableName} 
              className= {partDisplayClasses}
            />
          )}
          {getCurrentPart(PartCategory.Head) && (
            <img 
              src={getCurrentPart(PartCategory.Head)?.imageSource} 
              alt={getCurrentPart(PartCategory.Head)?.readableName} 
              className={partDisplayClasses}
            />
          )}
          {getCurrentPart(PartCategory.Legs) && (
            <img 
              src={getCurrentPart(PartCategory.Legs)?.rightImageSource} 
              alt={`${getCurrentPart(PartCategory.Legs)?.readableName} Right`} 
              className={partDisplayClasses}
            />
          )}
          {getCurrentPart(PartCategory.Arms) && (
            <img 
              src={getCurrentPart(PartCategory.Arms)?.rightImageSource} 
              alt={`${getCurrentPart(PartCategory.Arms)?.readableName} Right`} 
              className={partDisplayClasses} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
