import { useState } from 'react';
import { FaSpinner, FaCopy, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import aiService from '../services/aiService';

const AITools = () => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('summary');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [numberOfFlashcards, setNumberOfFlashcards] = useState(5);

  const handleGenerateSummary = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateSummary(topic);
      setContent(result);
      toast.success('Summary generated!');
    } catch {
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateQuestions(topic, numberOfQuestions);
      setContent(result);
      toast.success('Questions generated!');
    } catch {
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateFlashcards(topic, numberOfFlashcards);
      setContent(result);
      toast.success('Flashcards generated!');
    } catch {
      toast.error('Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateStudyPlan(topic);
      setContent(result);
      toast.success('Study plan generated!');
    } catch {
      toast.error('Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const handleDownloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic}-${activeTool}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded!');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Study Assistant</h1>
        <p className="text-gray-600 text-sm mt-1">Generate summaries, questions, flashcards, and study plans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Panel - Tool Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic or Subject:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Binary Trees..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Tool Cards */}
            <div className="space-y-3 mb-6">
              {/* Summary Tool */}
              <div
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  activeTool === 'summary'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveTool('summary');
                  setContent('');
                }}
              >
                <button className="w-full text-left font-semibold text-gray-900 mb-1">
                  📝 Summary
                </button>
                <p className="text-xs text-gray-600">Generate concise overview</p>
              </div>

              {/* Questions Tool */}
              <div
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  activeTool === 'questions'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveTool('questions');
                  setContent('');
                }}
              >
                <button className="w-full text-left font-semibold text-gray-900 mb-2">
                  ❓ Questions
                </button>
                <p className="text-xs text-gray-600 mb-2">Generate practice questions</p>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                  placeholder="Count"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Flashcards Tool */}
              <div
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  activeTool === 'flashcards'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveTool('flashcards');
                  setContent('');
                }}
              >
                <button className="w-full text-left font-semibold text-gray-900 mb-2">
                  🎴 Flashcards
                </button>
                <p className="text-xs text-gray-600 mb-2">Create digital flashcards</p>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfFlashcards}
                  onChange={(e) => setNumberOfFlashcards(parseInt(e.target.value))}
                  placeholder="Count"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Study Plan Tool */}
              <div
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  activeTool === 'plan'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveTool('plan');
                  setContent('');
                }}
              >
                <button className="w-full text-left font-semibold text-gray-900 mb-1">
                  📚 Study Plan
                </button>
                <p className="text-xs text-gray-600">Get a structured plan</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (activeTool === 'summary') handleGenerateSummary();
                else if (activeTool === 'questions') handleGenerateQuestions();
                else if (activeTool === 'flashcards') handleGenerateFlashcards();
                else if (activeTool === 'plan') handleGenerateStudyPlan();
              }}
              disabled={loading || !topic.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Generating...
                </>
              ) : (
                '✨ Generate'
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Content Display */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {content ? (
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyContent}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1"
                    title="Copy"
                  >
                    <FaCopy /> Copy
                  </button>
                  <button
                    onClick={handleDownloadContent}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1"
                    title="Download"
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto text-gray-700 leading-relaxed text-sm">
                {content.split('\n').map((line, index) => (
                  <p key={index} className={line.trim() === '' ? 'h-1' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
              <p className="text-gray-400 text-center text-sm">Select a tool and generate content to see results here</p>
            </div>
          )}
        </div>
      </div>

      {/* Guide Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to use:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <span className="text-blue-600 font-semibold shrink-0 text-lg">📝</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Summary</p>
              <p className="text-xs text-gray-600 mt-0.5">Get a concise overview of any topic</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-600 font-semibold shrink-0 text-lg">❓</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Questions</p>
              <p className="text-xs text-gray-600 mt-0.5">Generate practice questions for testing</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-600 font-semibold shrink-0 text-lg">🎴</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Flashcards</p>
              <p className="text-xs text-gray-600 mt-0.5">Create flashcards for memorization</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-600 font-semibold shrink-0 text-lg">📚</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Study Plan</p>
              <p className="text-xs text-gray-600 mt-0.5">Get structured plans with milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
