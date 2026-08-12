import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Send, PlusCircle } from 'lucide-react';
import { CollaborativeDiscussion } from '../types';

export const CollaborativeHub: React.FC = () => {
  const [discussions, setDiscussions] = useState<CollaborativeDiscussion[]>([
    {
      id: 'd1',
      author: 'Study Group Alpha (Alex & Maria)',
      topicId: '3.1',
      content: 'We noticed that converting complex nested regex like (a+b*)* directly to NFA can be simplified by stripping redundant internal epsilon closures. Here is our shared approach...',
      timestamp: '10 mins ago',
      upvotes: 14,
      commentsCount: 3,
    },
    {
      id: 'd2',
      author: 'Team Sigma (David & Chen)',
      topicId: '4.1',
      content: 'For the pumping lemma palindrome proof, picking w = 0^n 1 0^n is much easier than trying to pump binary strings with mixed zeros and ones. What do other groups think?',
      timestamp: '1 hour ago',
      upvotes: 22,
      commentsCount: 7,
    },
  ]);

  const [newContent, setNewContent] = useState('');
  const [authorName, setAuthorName] = useState('My Study Group');
  const [selectedTopic, setSelectedTopic] = useState('3.1');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const newDisc: CollaborativeDiscussion = {
      id: Date.now().toString(),
      author: authorName,
      topicId: selectedTopic,
      content: newContent,
      timestamp: 'Just now',
      upvotes: 1,
      commentsCount: 0,
    };
    setDiscussions([newDisc, ...discussions]);
    setNewContent('');
  };

  const handleUpvote = (id: string) => {
    setDiscussions(discussions.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/30">
            Pedagogical Method 3: Collaborative Group Learning
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-2">Peer Study Hub & Discussion Board</h2>
          <p className="text-slate-300 text-sm">
            Share problem-solving strategies, discuss alternative solutions, and collaborate with peers on Ullman chapters 3 and 4 automata proofs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post New Discussion */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Post Study Note or Question</span>
          </h3>
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Group / Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Section</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="3.1">3.1 Regular Expressions</option>
                <option value="3.2">3.2 Finite Automata & RegEx</option>
                <option value="3.3">3.3 Applications of RegEx</option>
                <option value="4.1">4.1 Pumping Lemma</option>
                <option value="4.2">4.2 Closure Properties</option>
                <option value="4.4">4.4 DFA Minimization</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discussion / Insight</label>
              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share your group's solution approach, question, or alternative method..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share with Class</span>
            </button>
          </form>
        </div>

        {/* Discussion Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Classroom Discussions Feed</h3>
          {discussions.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {d.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{d.author}</h4>
                    <span className="text-[10px] text-slate-400">{d.timestamp} • Section {d.topicId}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-bold border border-indigo-200">
                  Section {d.topicId}
                </span>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed">{d.content}</p>

              <div className="flex items-center space-x-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <button
                  onClick={() => handleUpvote(d.id)}
                  className="flex items-center space-x-1.5 hover:text-indigo-600 font-semibold transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{d.upvotes} Upvotes</span>
                </button>
                <div className="flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{d.commentsCount} Comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
