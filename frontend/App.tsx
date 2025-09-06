import React, { useState, useCallback } from 'react';
import { Milestone } from './types';
import GoalInputForm from './components/GoalInputForm';
import LoadingView from './components/LoadingView';
import BoosterPackList from './components/BoosterPackList';
import CardViewerView from './components/CardViewerView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[] | null>(null);
  const [goalPrompt, setGoalPrompt] = useState<string>('');
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number | null>(null);
  const [isFetchingTasks, setIsFetchingTasks] = useState<boolean>(false);

  const handleGeneratePlan = useCallback(async (prompt: string, imageFile: File | null) => {
    if (!prompt.trim()) {
      setError("Please enter your goal.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMilestones(null);
    setGoalPrompt(prompt);

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
    setSelectedMilestoneIndex(null);
    setIsFetchingTasks(false);
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
        />
      );
    }
    if (isLoading) {
      return <LoadingView />;
    }
    if (milestones) {
      return <BoosterPackList milestones={milestones} onStartOver={handleStartOver} onMilestoneSelect={handleMilestoneSelect} />;
    }
    return <GoalInputForm onGeneratePlan={handleGeneratePlan} isLoading={isLoading} error={error} />;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between text-slate-800 dark:text-slate-200 p-4 font-sans bg-yellow-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;