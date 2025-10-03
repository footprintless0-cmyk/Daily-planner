'use client';

import { useState } from 'react';
import { applyUserTemplate } from '@/lib/users';

const OnboardingPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // In a real application, we would get the user ID from the session
  const userId = '1'; // Placeholder user ID

  const templates = [
    {
      id: 'student-planner',
      name: 'Student Planner',
      description: 'Perfect for organizing classes, assignments, and study sessions',
      icon: '📚',
      color: 'bg-blue-100 text-blue-800',
      tags: ['homework', 'exam', 'project'],
      tasks: ['Math Homework', 'History Essay', 'Science Lab', 'Study for Midterms']
    },
    {
      id: 'business-sprint',
      name: 'Business Sprint',
      description: 'Ideal for project management and team collaboration',
      icon: '💼',
      color: 'bg-green-100 text-green-800',
      tags: ['meeting', 'project', 'review'],
      tasks: ['Sprint Planning', 'Team Standup', 'Client Meeting', 'Project Review']
    },
    {
      id: 'personal-goals',
      name: 'Personal Goals',
      description: 'Organize your personal projects and life goals',
      icon: '🎯',
      color: 'bg-purple-100 text-purple-800',
      tags: ['health', 'hobby', 'finance'],
      tasks: ['Morning Run', 'Read 30 mins', 'Budget Review', 'New Skill Learning']
    },
    {
      id: 'creative-work',
      name: 'Creative Work',
      description: 'Structure your creative projects and deadlines',
      icon: '🎨',
      color: 'bg-red-100 text-red-800',
      tags: ['draft', 'review', 'publish'],
      tasks: ['Content Research', 'First Draft', 'Editorial Review', 'Final Publishing']
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Extract template name from the selected template
      const templateName = templates.find(t => t.id === selectedTemplate)?.name || '';
      
      // In a real implementation, this would apply the template
      const result = await applyUserTemplate(userId, templateName);
      console.log('Template applied:', result);
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to apply template');
      console.error('Error applying template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // In a real application, this would skip the onboarding process
    console.log('Onboarding skipped');
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Template Applied!</h2>
          <p className="mt-2 text-gray-600">
            Your template has been applied successfully. You can now start organizing your tasks.
          </p>
          <div className="mt-6">
            <a 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FocusFlow!</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get started quickly with a template that matches your needs. 
          Don't worry, you can always customize it later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start">
              <div className="text-2xl mr-4">{template.icon}</div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Selected
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-600">{template.description}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Sample tasks:</h4>
                  <ul className="mt-2 space-y-1">
                    {template.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-900">Suggested tags:</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${template.color}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleSkip}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Skip for now
        </button>
        
        <button
          onClick={handleApplyTemplate}
          disabled={loading || !selectedTemplate}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            selectedTemplate 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-indigo-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Applying...' : 'Apply Template'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;