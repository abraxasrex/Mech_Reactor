import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MechPartService } from '../../services/MechPartService';
import { MechPart, PartCategory } from '../../models/MechPart';
import Layout from '../views/Layout';
import PartArrangementEditor from '../views/PartArrangementEditor';
import Login from '../auth/Login';
import Register from '../auth/Register';
import { HelpHandlePrevious, HelpHandleNext} from '../../helpers/Helpers';
import {MechDisplay} from '../views/MechDisplay';
import ProtectedRoute from '../auth/ProtectedRoute';
import { Console } from 'console';




// Main App  Content component
const AppContent: React.FC = () => {

  console.log('AppContent initialized');

  // 1.Initialize Hooks
  const [mechParts, setMechParts] = useState<MechPart[] | null>(null); // Start with null
  const [selectedParts, setSelectedParts] = useState<Record<PartCategory, number> | null>(null); // Start with null

  //2. Load Mech Parts Data from API or default
  const loadMechParts = useCallback(async () => {
      try {
        console.log("loading mech parts DEFINED")
        const parts = await MechPartService.loadMechParts();
        setMechParts(parts);

        // Initialize selectedParts based on the loaded mechParts
        const initialSelectedParts = {
          [PartCategory.Head]: 0,
          [PartCategory.Chassis]: 0,
          [PartCategory.Arms]: 0,
          [PartCategory.Legs]: 0,
        };
        setSelectedParts(initialSelectedParts);
      } catch (error) {
        console.error("Error loading mech parts:", error);
      }
   }, []);

  useEffect(() => {
            console.log("loading mech parts CALLED")
    loadMechParts();
  }, []);

  // 3. Setup helper UI methods
  const handlePrevious = useCallback(
    HelpHandlePrevious(setSelectedParts, mechParts)
  , [mechParts, setSelectedParts]);

  const handleNext= useCallback(
    HelpHandleNext(setSelectedParts, mechParts)
  , [mechParts, setSelectedParts]);


  //4. handle pending loading state
  if (!mechParts || !selectedParts) {
    return <div>Loading...</div>; // Show a loading state until data is ready
  } 

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <MechDisplay 
              mechParts={mechParts}
              selectedParts={selectedParts}
              onPreviousPart={handlePrevious}
              onNextPart={handleNext}
            />
          </ProtectedRoute>
        } />
        <Route 
          path="editor" 
          element={
            <ProtectedRoute>
              <PartArrangementEditor 
                mechParts={mechParts}
                selectedParts={selectedParts}
              />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppContent;