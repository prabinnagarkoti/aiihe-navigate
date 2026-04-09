'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Send, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Feedback</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Help us improve the AIIHE Navigate accessibility features or report incorrect routes.
        </p>
      </div>

      {submitted ? (
        <Card className="text-center py-12 px-6">
          <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your feedback has been anonymously submitted to the campus development team. 
          </p>
          <Button className="mt-8" onClick={() => setSubmitted(false)}>Submit Another</Button>
        </Card>
      ) : (
        <Card className="glass-panel">
          <form 
            className="space-y-6" 
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="space-y-2">
              <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Topic
              </label>
              <select id="topic" required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-400 outline-none">
                <option value="">Select a topic...</option>
                <option value="accessibility">Accessibility Barrier Encountered</option>
                <option value="route">Incorrect Routing</option>
                <option value="kiosk">Smart Kiosk Feedback</option>
                <option value="other">Other Suggestion</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea 
                id="message" 
                rows={5} 
                required
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-400 outline-none"
                placeholder="Please describe the issue or suggestion in detail..."
              />
            </div>

            <Button 
              type="submit"
              variant="primary" 
              size="lg" 
              fullWidth
              icon={<Send size={20} />}
            >
              Submit Feedback
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
