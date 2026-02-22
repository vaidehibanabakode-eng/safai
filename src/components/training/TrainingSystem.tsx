import React, { useState, useEffect } from 'react';
import {
  Play,
  Trophy,
  Star,
  Clock,
  CheckCircle,
  Lock,
  Heart,
  Award,
  Target,
  BookOpen,
  Download,
  Share2,
  Video
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User } from '../../App';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { TRAINING_MODULES, TrainingModule, Exercise } from '../../data/trainingModules';

interface TrainingSystemProps {
  user: User;
}

interface UserProgress {
  completedModules: number[];
  totalPoints: number;
  certificates: string[];
  currentStreak: number;
  lastActivityDate: string | null;
  hearts: number;
  level: number;
  xp: number;
  achievements: string[];
}

interface ExerciseState {
  currentModule: TrainingModule | null;
  currentExercise: Exercise | null;
  exerciseIndex: number;
  score: number;
  hearts: number;
  selectedAnswer: any;
  matchingState: any;
  videoWatched: boolean;
}

const TrainingSystem: React.FC<TrainingSystemProps> = ({ user }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: [],
    totalPoints: 0,
    certificates: [],
    currentStreak: 0,
    lastActivityDate: null,
    hearts: 5,
    level: 1,
    xp: 0,
    achievements: []
  });

  const [exerciseState, setExerciseState] = useState<ExerciseState>({
    currentModule: null,
    currentExercise: null,
    exerciseIndex: 0,
    score: 0,
    hearts: 5,
    selectedAnswer: null,
    matchingState: null,
    videoWatched: false
  });

  const [showExercise, setShowExercise] = useState(false);

  const modules = TRAINING_MODULES[user.role] || [];

  useEffect(() => {
    loadUserProgress();
  }, [user.id]);

  const loadUserProgress = async () => {
    try {
      const docRef = doc(db, 'training', user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProgress({
          completedModules: data.completedModules || [],
          totalPoints: data.totalPoints || 0,
          certificates: data.certificates || [],
          currentStreak: data.currentStreak || 0,
          lastActivityDate: data.lastActivityDate || null,
          hearts: data.hearts !== undefined ? data.hearts : 5,
          level: data.level || 1,
          xp: data.xp || 0,
          achievements: data.achievements || []
        });
      }
    } catch (error) {
      console.error('Error loading training progress:', error);
    }
  };

  const saveUserProgress = async (progress: UserProgress) => {
    setUserProgress(progress);
    try {
      // Also ensuring we save userId for comprehensive tracking
      const dataToSave = { ...progress, userId: user.id };
      await setDoc(doc(db, 'training', user.id), dataToSave, { merge: true });
    } catch (error) {
      console.error('Error saving training progress:', error);
    }
  };

  const startModule = (module: TrainingModule) => {
    if (userProgress.completedModules.includes(module.id)) {
      // Module already completed - show review option
      return;
    }

    // Check prerequisites
    if (module.prerequisites) {
      const unmetPrereqs = module.prerequisites.filter(
        prereq => !userProgress.completedModules.includes(prereq)
      );
      if (unmetPrereqs.length > 0) {
        alert('Please complete prerequisite modules first');
        return;
      }
    }

    setExerciseState({
      currentModule: module,
      currentExercise: module.exercises[0],
      exerciseIndex: 0,
      score: 0,
      hearts: userProgress.hearts,
      selectedAnswer: null,
      matchingState: null,
      videoWatched: false
    });
    setShowExercise(true);
  };

  const submitAnswer = () => {
    const { currentExercise, selectedAnswer, videoWatched } = exerciseState;
    if (!currentExercise) return;

    let isCorrect = false;

    switch (currentExercise.type) {
      case 'video-lecture':
        isCorrect = videoWatched;
        break;
      case 'multiple-choice':
      case 'scenario':
        isCorrect = selectedAnswer === currentExercise.correctAnswer;
        break;
      case 'true-false':
        isCorrect = selectedAnswer === currentExercise.correctAnswer;
        break;
      default:
        isCorrect = true; // Simplified for other types
    }

    processAnswer(isCorrect);
  };

  const processAnswer = (isCorrect: boolean) => {
    const newState = { ...exerciseState };

    if (isCorrect) {
      newState.score += exerciseState.currentExercise?.points || 10;
    } else {
      newState.hearts = Math.max(0, newState.hearts - 1);
      if (newState.hearts === 0) {
        // Game over
        setExerciseState(newState);
        return;
      }
    }

    // Move to next exercise
    newState.exerciseIndex++;

    if (newState.exerciseIndex >= (exerciseState.currentModule?.exercises.length || 0)) {
      // Module completed
      completeModule(newState.score);
    } else {
      newState.currentExercise = exerciseState.currentModule?.exercises[newState.exerciseIndex] || null;
      newState.selectedAnswer = null;
      newState.videoWatched = false;
      setExerciseState(newState);
    }
  };

  const completeModule = (finalScore: number) => {
    const newProgress = { ...userProgress };

    if (exerciseState.currentModule) {
      if (!newProgress.completedModules.includes(exerciseState.currentModule.id)) {
        newProgress.completedModules.push(exerciseState.currentModule.id);
        // Increment xp by exactly 100 as requested
        newProgress.xp += 100;
      }

      newProgress.totalPoints += finalScore; // keeping original score logic alongside new XP logic just in case
      // Increment current level for every 500 xp
      newProgress.level = Math.floor(newProgress.xp / 500) + 1;
      newProgress.hearts = exerciseState.hearts;
      newProgress.lastActivityDate = new Date().toISOString();

      // Update streak
      const today = new Date();
      const lastActivity = newProgress.lastActivityDate ? new Date(newProgress.lastActivityDate) : null;
      if (lastActivity && isSameDay(lastActivity, today)) {
        // Same day
      } else if (lastActivity && isConsecutiveDay(lastActivity, today)) {
        newProgress.currentStreak += 1;
      } else {
        newProgress.currentStreak = 1;
      }

      saveUserProgress(newProgress);
    }

    setShowExercise(false);
    // Module completed logic here
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isConsecutiveDay = (lastDate: Date, currentDate: Date) => {
    const nextDay = new Date(lastDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return isSameDay(nextDay, currentDate);
  };

  const selectAnswer = (answer: any) => {
    setExerciseState(prev => ({ ...prev, selectedAnswer: answer }));
  };

  const markVideoAsWatched = () => {
    setExerciseState(prev => ({ ...prev, videoWatched: true }));
  };

  const renderModuleCard = (module: TrainingModule) => {
    const isCompleted = userProgress.completedModules.includes(module.id);
    const isLocked = module.prerequisites &&
      module.prerequisites.some(prereq => !userProgress.completedModules.includes(prereq));

    return (
      <div
        key={module.id}
        className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${isCompleted
          ? 'border-green-200 bg-green-50'
          : isLocked
            ? 'border-gray-200 bg-gray-50 opacity-60'
            : 'border-gray-200 hover:border-green-300'
          }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-2">{module.icon}</div>
          <div className="flex items-center gap-2">
            {isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}
            {isLocked && <Lock className="w-6 h-6 text-gray-400" />}
            <span className="text-sm font-semibold text-gray-600">Level {module.level}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{module.description}</p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{module.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{module.points} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{module.exercises.length} exercises</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Learning Objectives:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {module.objectives.slice(0, 2).map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <Target className="w-3 h-3 mt-1 text-green-500 flex-shrink-0" />
                <span>{objective}</span>
              </li>
            ))}
            {module.objectives.length > 2 && (
              <li className="text-gray-400">+{module.objectives.length - 2} more...</li>
            )}
          </ul>
        </div>

        <button
          onClick={() => startModule(module)}
          disabled={isLocked}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isCompleted
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : isLocked
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
        >
          {isCompleted ? (
            <>
              <Trophy className="w-5 h-5" />
              Review Module
            </>
          ) : isLocked ? (
            <>
              <Lock className="w-5 h-5" />
              Locked
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Learning
            </>
          )}
        </button>
      </div>
    );
  };

  const renderExercise = () => {
    if (!exerciseState.currentExercise || !exerciseState.currentModule) return null;

    const exercise = exerciseState.currentExercise;
    const progress = ((exerciseState.exerciseIndex + 1) / exerciseState.currentModule.exercises.length) * 100;
    const isVideo = exercise.type === 'video-lecture';
    const canSubmit = isVideo ? exerciseState.videoWatched : exerciseState.selectedAnswer !== null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{exerciseState.currentModule.title}</h2>
                <p className="text-gray-600">Exercise {exerciseState.exerciseIndex + 1} of {exerciseState.currentModule.exercises.length}</p>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${i < exerciseState.hearts ? 'text-red-500 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Exercise Content */}
          <div className="p-6">
            {renderExerciseContent(exercise)}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setShowExercise(false)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Exit
            </button>
            <button
              onClick={submitAnswer}
              disabled={!canSubmit}
              className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isVideo ? 'Complete Lesson' : 'Submit Answer'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderExerciseContent = (exercise: Exercise) => {
    switch (exercise.type) {
      case 'video-lecture':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{exercise.videoTitle}</h3>
              <p className="text-gray-600 mb-6">{exercise.question}</p>
            </div>

            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${exercise.videoUrl}`}
                title={exercise.videoTitle}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={markVideoAsWatched} // Simple tracking for now
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Learning Tip</h4>
                  <p className="text-blue-700 text-sm">{exercise.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'multiple-choice':
      case 'scenario':
        return (
          <div className="space-y-6">
            <div className="text-center">
              {exercise.image && (
                <div className="text-6xl mb-4">{exercise.image}</div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{exercise.question}</h3>
              {exercise.scenario && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
                  <p className="text-gray-700">{exercise.scenario}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              {exercise.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${exerciseState.selectedAnswer === index
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${exerciseState.selectedAnswer === index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                      }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{exercise.statement}</h3>
              {exercise.context && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left max-w-2xl mx-auto">
                  <p className="text-gray-700">{exercise.context}</p>
                </div>
              )}
            </div>

            <div className="flex gap-6 justify-center">
              <button
                onClick={() => selectAnswer(true)}
                className={`px-12 py-8 rounded-2xl border-2 transition-all duration-200 ${exerciseState.selectedAnswer === true
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 text-green-500">✓</div>
                  <div className="text-xl font-bold text-gray-800">TRUE</div>
                </div>
              </button>

              <button
                onClick={() => selectAnswer(false)}
                className={`px-12 py-8 rounded-2xl border-2 transition-all duration-200 ${exerciseState.selectedAnswer === false
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 text-red-500">✗</div>
                  <div className="text-xl font-bold text-gray-800">FALSE</div>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Exercise type not implemented yet</p>
          </div>
        );
    }
  };

  const renderStats = () => {
    const completionRate = modules.length > 0 ? (userProgress.completedModules.length / modules.length) * 100 : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-200 rounded-xl">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{userProgress.level}</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Current Level</h3>
          <p className="text-gray-800 font-semibold">{userProgress.xp} XP Earned</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Completion Rate</h3>
          <p className="text-gray-800 font-semibold">{userProgress.completedModules.length}/{modules.length} modules</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-200 rounded-xl">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">{userProgress.certificates.length}</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Certificates</h3>
          <p className="text-gray-800 font-semibold">Professional Certifications</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-200 rounded-xl">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">Active</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Training Status</h3>
          <p className="text-gray-800 font-semibold">On Track</p>
        </div>
      </div>
    );
  };

  if (showExercise) {
    return renderExercise();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Training Center
          </h1>
          <p className="text-xl text-gray-600">
            Master waste management skills through interactive modules
          </p>
        </div>
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <LanguageSwitcher />
        </div>
      </div>

      {renderStats()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(renderModuleCard)}
      </div>

      {userProgress.certificates.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificates Earned</h2>
            <p className="text-gray-600 mb-6">You have {userProgress.certificates.length} certificate(s)</p>
            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
                <Download className="w-5 h-5" />
                Download Certificates
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                <Share2 className="w-5 h-5" />
                Share Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSystem;