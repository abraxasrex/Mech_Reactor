import React, { useState, MouseEvent, useRef, useEffect } from 'react';
import { MechPart, PartCategory } from '../models/MechPart';
import PartCategoryUI from './PartCategoryUI';

interface PartPosition {
    x: number;
    y: number;
}

interface PartHitTest {
    category: PartCategory;
    element: HTMLImageElement;
    rect: DOMRect;
}

interface PartArrangementEditorProps {
    mechParts: MechPart[];
    selectedParts: Record<PartCategory, number>;
}

const PartArrangementEditor: React.FC<PartArrangementEditorProps> = ({ mechParts, selectedParts: initialSelectedParts }) => {
    const mechDisplaySize = "full";
    const basePartDisplayClasses = `absolute object-cover`;
    const parentColumnSetting = "grid-cols-12";
    const UIColumnSetting = "col-span-5";
    const partDisplayColumnSetting = "col-span-7";
    
    const [selectedParts, setSelectedParts] = useState<Record<PartCategory, number>>(initialSelectedParts);
    const [partPositions, setPartPositions] = useState<Record<PartCategory, PartPosition>>({
        [PartCategory.Head]: { x: 0, y: 0 },
        [PartCategory.Arms]: { x: 0, y: 0 },
        [PartCategory.Legs]: { x: 0, y: 0 },
        [PartCategory.Chassis]: { x: 0, y: 0 },
    });
    const draggingPartRef = useRef<PartCategory | null>(null);
    const [draggingPart, setDraggingPart] = useState<PartCategory | null>(null);
    const [dragOffset, setDragOffset] = useState<PartPosition>({ x: 0, y: 0 });
    const hitTestCanvasRef = useRef<HTMLCanvasElement>(null);
    const partsRef = useRef<PartHitTest[]>([]);

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

    const handleMouseDown = async (e: MouseEvent) => {
        e.preventDefault();
        
        const container = document.querySelector('.mech-visualization') as HTMLElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const clickX = e.clientX - containerRect.left;
        const clickY = e.clientY - containerRect.top;

        const parts = partsRef.current;
        
        // Sort parts by z-index (reverse order) to handle overlapping parts correctly
        const sortedParts = [...parts].sort((a, b) => {
            const aIndex = Object.values(PartCategory).indexOf(a.category);
            const bIndex = Object.values(PartCategory).indexOf(b.category);
            return bIndex - aIndex;
        });

      //  console.log("mouse down event");

        for (const part of sortedParts) {
            if (part.category === PartCategory.Chassis) continue;

            const partPosition = partPositions[part.category];
            const localX = clickX - (part.rect.left - containerRect.left);
            const localY = clickY - (part.rect.top - containerRect.top);

            if (localX < 0 || localX > part.rect.width || localY < 0 || localY > part.rect.height) {
                continue;
            }

            const canvas = hitTestCanvasRef.current;
            if (!canvas) continue;

            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            canvas.width = part.element.naturalWidth;
            canvas.height = part.element.naturalHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(part.element, 0, 0);

            const pixel = ctx.getImageData(
                Math.floor((localX / part.rect.width) * canvas.width),
                Math.floor((localY / part.rect.height) * canvas.height),
                1, 1
            ).data;

           // console.log("mouse down  passes deps, pixel: ", pixel);


            if (pixel[3] !== 0) {
                // Calculate offset relative to the part's current position
                console.log("part position 1, x: " + partPosition.x + " y: " + partPosition.y);
                setDragOffset({
                    x: clickX - partPosition.x,
                    y: clickY - partPosition.y
                });
                setDraggingPart(part.category);
                draggingPartRef.current = part.category;

                console.log("part position 2, x: " + partPosition.x + " y: " + partPosition.y);

                
                // Add document-level event handlers
                const docMouseMove = (e: globalThis.MouseEvent) => {
                    e.preventDefault();


                    const container = document.querySelector('.mech-visualization') as HTMLElement;

                  //  console.log("mouse move, dragging part: " + draggingPartRef.current + " container: " + container);

                    if (!draggingPartRef.current) return;
                    if (!container) return;
                    
                    const containerRect = container.getBoundingClientRect();
                    

                    setPartPositions(prev => {
                        if (!draggingPartRef.current) return prev;

                        console.log("drag offset at set position, x: " + dragOffset.x + " y: " + dragOffset.y);

                        return {
                            ...prev,
                            [draggingPartRef.current as keyof typeof prev]: {
                                x: e.clientX - containerRect.left - dragOffset.x,
                                y: e.clientY - containerRect.top - dragOffset.y
                            }
                        };
                    });
                };

                const docMouseUp = (e: globalThis.MouseEvent) => {
                    e.preventDefault();
                   // console.log('Mouse up ');
                    setDraggingPart(null);
                    draggingPartRef.current = null;
                    document.removeEventListener('mousemove', docMouseMove);
                    document.removeEventListener('mouseup', docMouseUp);
                };

                document.addEventListener('mousemove', docMouseMove);
                document.addEventListener('mouseup', docMouseUp);
                return;
            }
        }
    };

    useEffect(() => {
        const updatePartsRef = () => {
            const container = document.querySelector('.mech-visualization');
            if (!container) return;

            const parts: PartHitTest[] = [];
            
            container.querySelectorAll('img').forEach(img => {
                const category = Object.values(PartCategory).find(cat => 
                    img.alt?.includes(getCurrentPart(cat)?.readableName || '')
                );
                
                if (category && img instanceof HTMLImageElement) {
                    parts.push({
                        category,
                        element: img,
                        rect: img.getBoundingClientRect()
                    });
                }
            });

            partsRef.current = parts;
        };

        updatePartsRef();
        window.addEventListener('resize', updatePartsRef);

        return () => {
            window.removeEventListener('resize', updatePartsRef);
        };
    }, [partPositions, selectedParts, getCurrentPart]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Part Arrangement Editor</h1>
            <canvas 
                ref={hitTestCanvasRef} 
                style={{ display: 'none' }}
            />
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

                <div 
                    className={`grid ${partDisplayColumnSetting} mech-visualization relative w-${mechDisplaySize} h-${mechDisplaySize} mx-auto top-[-10rem]`}
                    onMouseDown={handleMouseDown}
                >
                    {getCurrentPart(PartCategory.Arms) && (
                        <>
                            <img 
                                src={getCurrentPart(PartCategory.Arms)?.leftImageSource} 
                                alt={`${getCurrentPart(PartCategory.Arms)?.readableName} Left`} 
                                className={`${basePartDisplayClasses} cursor-move`}
                                style={{
                                    transform: `translate(${partPositions[PartCategory.Arms].x}px, ${partPositions[PartCategory.Arms].y}px)`,
                                    userSelect: 'none'
                                }}
                            />
                            <img 
                                src={getCurrentPart(PartCategory.Arms)?.rightImageSource} 
                                alt={`${getCurrentPart(PartCategory.Arms)?.readableName} Right`} 
                                className={`${basePartDisplayClasses} cursor-move`}
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
                                className={`${basePartDisplayClasses} cursor-move`}
                                style={{
                                    transform: `translate(${partPositions[PartCategory.Legs].x}px, ${partPositions[PartCategory.Legs].y}px)`,
                                    userSelect: 'none'
                                }}
                            />
                            <img 
                                src={getCurrentPart(PartCategory.Legs)?.rightImageSource} 
                                alt={`${getCurrentPart(PartCategory.Legs)?.readableName} Right`} 
                                className={`${basePartDisplayClasses} cursor-move`}
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
                            className={basePartDisplayClasses}
                        />
                    )}
                    {getCurrentPart(PartCategory.Head) && (
                        <img 
                            src={getCurrentPart(PartCategory.Head)?.imageSource} 
                            alt={getCurrentPart(PartCategory.Head)?.readableName} 
                            className={`${basePartDisplayClasses} cursor-move`}
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

export default PartArrangementEditor;