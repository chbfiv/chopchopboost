import React, { useState, useCallback } from 'react';
import { Milestone } from './types';
import GoalInputForm from './components/GoalInputForm';
import LoadingView from './components/LoadingView';
import BoosterPackList from './components/BoosterPackList';
import CardViewerView from './components/CardViewerView';
import TopBar from './components/TopBar';
import { Footer } from './components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[] | null>(null);
  const [goalPrompt, setGoalPrompt] = useState<string>('');
  const [seriesName, setSeriesName] = useState<string>('');
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number | null>(null);
  const [isFetchingTasks, setIsFetchingTasks] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'home' | 'series' | 'milestone'>('home');
  const [boosterIndex, setBoosterIndex] = useState<number>(0);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  const handleGeneratePlan = useCallback(async (prompt: string, imageFile: File | null) => {
    if (!prompt.trim()) {
      setError("Please enter your goal.");
      return;
    }

  setIsLoading(true);
  setError(null);
  setMilestones(null);
  setGoalPrompt(prompt);
  setSeriesName(''); // Series name will be set from GenAI response

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const response = await fetch(`${API_BASE_URL}/api/generate-milestones`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }
      const generatedPlan = await response.json();
      setMilestones(generatedPlan);
      setSeriesName(generatedPlan[0].title.split(':')[1]?.trim() || generatedPlan[0].title.trim());
      setCurrentView('series');
      setBoosterIndex(0);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMilestoneSelect = useCallback(async (index: number) => {
    if (!milestones) return;
    
    const selectedMilestone = milestones[index];
    if (selectedMilestone.isCompleted) return;

    setSelectedMilestoneIndex(index);
    setCurrentView('milestone');
    setCurrentCardIndex(0);

    if (selectedMilestone.tasks) {
      return;
    }

    setIsFetchingTasks(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ milestone: selectedMilestone, seriesTheme: goalPrompt }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate tasks');
      }
      const tasks = await response.json();
      setMilestones(prevMilestones => {
        if (!prevMilestones) return null;
        const newMilestones = [...prevMilestones];
        newMilestones[index].tasks = tasks;
        return newMilestones;
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not load tasks. Please go back and try again.");
    } finally {
      setIsFetchingTasks(false);
    }
  }, [milestones, goalPrompt]);


  const handleBackToList = () => {
    setSelectedMilestoneIndex(null);
    setError(null);
    setCurrentView('series');
  };

  const handleMilestoneComplete = (index: number) => {
    setMilestones(prev => {
      if (!prev) return null;
      const newMilestones = [...prev];
      newMilestones[index].isCompleted = true;
      return newMilestones;
    });
    // No longer need to navigate back from here, CardViewerView handles it
  };

  const handleStartOver = () => {
    setIsLoading(false);
    setError(null);
    setMilestones(null);
    setGoalPrompt('');
    setSeriesName('');
    setSelectedMilestoneIndex(null);
    setIsFetchingTasks(false);
    setCurrentView('home');
    setBoosterIndex(0);
    setCurrentCardIndex(0);
  };

  const getBreadcrumbs = () => {
    const crumbs = ['Home'];
    if (currentView === 'series') {
      crumbs.push(seriesName || 'Series');
    } else if (currentView === 'milestone' && selectedMilestoneIndex !== null && milestones) {
      crumbs.push(seriesName || 'Series');
      crumbs.push(milestones[selectedMilestoneIndex].title);
    }
    return crumbs;
  };

  const handleNavigateLeft = () => {
    if (currentView === 'series' && milestones) {
      setBoosterIndex(prev => Math.max(0, prev - 1));
    } else if (currentView === 'milestone' && milestones && selectedMilestoneIndex !== null) {
      const selectedMilestone = milestones[selectedMilestoneIndex];
      if (selectedMilestone.tasks) {
        setCurrentCardIndex(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleNavigateRight = () => {
    if (currentView === 'series' && milestones) {
      setBoosterIndex(prev => Math.min(milestones.length - 1, prev + 1));
    } else if (currentView === 'milestone' && milestones && selectedMilestoneIndex !== null) {
      const selectedMilestone = milestones[selectedMilestoneIndex];
      if (selectedMilestone.tasks) {
        setCurrentCardIndex(prev => Math.min(selectedMilestone.tasks.length - 1, prev + 1));
      }
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      // Home
      handleStartOver();
    } else if (index === 1 && currentView === 'milestone') {
      // Series
      setSelectedMilestoneIndex(null);
      setCurrentView('series');
    }
    // For series view, clicking Series does nothing
  };

  const renderContent = () => {
    const selectedMilestone = selectedMilestoneIndex !== null && milestones ? milestones[selectedMilestoneIndex] : null;

    if (selectedMilestone && selectedMilestoneIndex !== null) {
      return (
        <CardViewerView
          milestone={selectedMilestone}
          milestoneIndex={selectedMilestoneIndex}
          onBack={handleBackToList}
          onComplete={handleMilestoneComplete}
          isLoadingTasks={isFetchingTasks}
          error={error}
          currentCardIndex={currentCardIndex}
          onCardIndexChange={setCurrentCardIndex}
        />
      );
    }
    if (isLoading) {
      return <LoadingView />;
    }
    if (milestones) {
      return <BoosterPackList 
        milestones={milestones} 
        onMilestoneSelect={handleMilestoneSelect}
        currentIndex={boosterIndex}
        onIndexChange={setBoosterIndex}
      />;
    }
    return <GoalInputForm onGeneratePlan={handleGeneratePlan} isLoading={isLoading} error={error} />;
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-between text-slate-800 dark:text-slate-200 font-sans bg-yellow-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="w-full flex-shrink-0">
        <TopBar
          onCreateNewSeries={currentView !== 'home' ? handleStartOver : undefined}
          breadcrumbs={getBreadcrumbs()}
          onNavigateLeft={handleNavigateLeft}
          onNavigateRight={handleNavigateRight}
          showNavigation={currentView === 'series' || currentView === 'milestone'}
          currentPosition={
            currentView === 'series' && milestones ? `${boosterIndex + 1}/${milestones.length}` :
            currentView === 'milestone' && milestones && selectedMilestoneIndex !== null && milestones[selectedMilestoneIndex].tasks ? 
              `${currentCardIndex + 1}/${milestones[selectedMilestoneIndex].tasks!.length}` : 
              undefined
          }
          currentView={currentView}
          onBreadcrumbClick={handleBreadcrumbClick}
        />
      </div>
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-2 md:px-8 py-2 md:py-8 overflow-hidden">
        {renderContent()}
      </main>
      <div className="w-full flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}

export default App;