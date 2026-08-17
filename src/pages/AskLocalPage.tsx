import React, { useState, useEffect } from 'react';
import { HelpCircle, ShieldCheck, ThumbsUp, MessageSquare, Plus, MapPin } from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { LocalQuestion, LocalAnswer } from '../types';

export const AskLocalPage: React.FC = () => {
  const [questions, setQuestions] = useState<LocalQuestion[]>(marketplaceStore.getState().questions);
  const [answers, setAnswers] = useState<LocalAnswer[]>(marketplaceStore.getState().answers);

  const [newQuestion, setNewQuestion] = useState('');
  const [destination, setDestination] = useState('Jaipur');

  const [answeringQId, setAnsweringQId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    return marketplaceStore.subscribe(() => {
      setQuestions(marketplaceStore.getState().questions);
      setAnswers(marketplaceStore.getState().answers);
    });
  }, []);

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    marketplaceStore.addQuestion(newQuestion, destination);
    setNewQuestion('');
  };

  const handlePostAnswer = (questionId: string) => {
    if (!answerText.trim()) return;

    const activeRole = marketplaceStore.getState().activeRole;
    const isGuide = activeRole === 'GUIDE';

    marketplaceStore.addAnswer(
      questionId,
      answerText,
      isGuide ? 'Rahul Sharma (Verified Guide)' : 'Aarav Patel (Local Host)',
      true
    );

    setAnsweringQId(null);
    setAnswerText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-extrabold">
          <HelpCircle className="w-4 h-4 text-sky-400" /> Community Knowledge Base
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Ask a Verified Local</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
          Get authentic local recommendations on food, transport, and hidden gems directly from identity-verified local hosts.
        </p>
      </div>

      {/* Post Question Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Ask the Local Community</h3>
        <form onSubmit={handlePostQuestion} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder="Ask e.g. Where can I find authentic Dal Baati in Jaipur?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Jaipur">Jaipur</option>
                <option value="Delhi">Delhi</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Agra">Agra</option>
                <option value="Varanasi">Varanasi</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post Question</span>
          </button>
        </form>
      </div>

      {/* Questions Feed */}
      <div className="space-y-6">
        {questions.map((q) => {
          const qAnswers = answers.filter(a => a.questionId === q.id);
          return (
            <div key={q.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={q.touristAvatar} alt={q.touristName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{q.question}</h4>
                    <span className="text-[11px] text-slate-400">Asked by {q.touristName} • {q.destination} • {q.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Answers List */}
              <div className="space-y-3 pt-2 pl-4 border-l-2 border-slate-100">
                {qAnswers.map((ans) => (
                  <div key={ans.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={ans.responderAvatar} alt={ans.responderName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-slate-900">{ans.responderName}</span>
                        {ans.isVerifiedLocal && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified Local
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[10px]">{ans.createdAt}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans">{ans.answer}</p>
                  </div>
                ))}
              </div>

              {/* Answer Input Box */}
              {answeringQId === q.id ? (
                <div className="bg-slate-100 p-3 rounded-2xl space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Write your verified local response..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePostAnswer(q.id)}
                      className="bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs"
                    >
                      Post Response
                    </button>
                    <button
                      onClick={() => setAnsweringQId(null)}
                      className="bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAnsweringQId(q.id)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Answer as Local Host</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
