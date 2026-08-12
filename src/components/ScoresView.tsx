import React, { useState, useEffect } from 'react';
import { QuizScoreRecord, UserProfile } from '../types';
import { Download, Table, Trash2, Search, Filter, Award, CheckCircle2, FileSpreadsheet, RefreshCw, UserCheck } from 'lucide-react';

interface ScoresViewProps {
  currentUser: UserProfile;
}

export const ScoresView: React.FC<ScoresViewProps> = ({ currentUser }) => {
  const [scores, setScores] = useState<QuizScoreRecord[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadScores = () => {
    try {
      const stored = localStorage.getItem('vtu_quiz_scores');
      if (stored) {
        setScores(JSON.parse(stored));
      } else {
        // Mock seed data for demonstration if empty
        const seedScores: QuizScoreRecord[] = [
          {
            id: 'score_1',
            userId: '1VT22CS001',
            userName: 'Rahul Sharma',
            userRole: 'student',
            moduleNumber: 1,
            score: 5,
            totalQuestions: 6,
            percentage: 83,
            timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(),
            userAnswers: {}
          },
          {
            id: 'score_2',
            userId: '1VT22CS002',
            userName: 'Priya Ananth',
            userRole: 'student',
            moduleNumber: 1,
            score: 6,
            totalQuestions: 6,
            percentage: 100,
            timestamp: new Date(Date.now() - 3600000 * 12).toLocaleString(),
            userAnswers: {}
          },
          {
            id: 'score_3',
            userId: '1VT22CS003',
            userName: 'Karthik V',
            userRole: 'student',
            moduleNumber: 2,
            score: 4,
            totalQuestions: 5,
            percentage: 80,
            timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString(),
            userAnswers: {}
          }
        ];
        localStorage.setItem('vtu_quiz_scores', JSON.stringify(seedScores));
        setScores(seedScores);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  const handleExportCSV = () => {
    if (scores.length === 0) {
      alert("No quiz scores recorded yet to export.");
      return;
    }

    // CSV Headers
    let csvContent = "USN/ID,Student Name,Role,Module,Score,Total Questions,Percentage,Timestamp\n";

    scores.forEach(s => {
      const row = [
        `"${s.userId}"`,
        `"${s.userName}"`,
        `"${s.userRole}"`,
        `"Module ${s.moduleNumber}"`,
        s.score,
        s.totalQuestions,
        `"${s.percentage}%"`,
        `"${s.timestamp}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VTU_Quiz_Scores_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetAttempt = (id: string, userName: string, modNum: number) => {
    if (!window.confirm(`Are you sure you want to reset the Module ${modNum} quiz attempt for ${userName}? This will allow the student to attempt the quiz again.`)) {
      return;
    }
    const updated = scores.filter(s => s.id !== id);
    setScores(updated);
    localStorage.setItem('vtu_quiz_scores', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (!window.confirm("Faculty Action: Clear ALL score records? This action cannot be undone.")) {
      return;
    }
    setScores([]);
    localStorage.setItem('vtu_quiz_scores', JSON.stringify([]));
  };

  const filteredScores = scores.filter(s => {
    const matchesMod = selectedModule === 'all' || s.moduleNumber === selectedModule;
    const matchesSearch = s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.userId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMod && matchesSearch;
  });

  const totalAttempts = scores.length;
  const avgPercentage = totalAttempts > 0
    ? Math.round(scores.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#F8F6F2] border border-[#1A1A1A]/10 rounded-sm p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV Database & Score Tracking</span>
          </div>
          <h2 className="font-serif italic text-3xl text-[#1A1A1A]">Student Quiz Performance & CSV Log Records</h2>
          <p className="text-xs text-[#1A1A1A]/70 max-w-2xl">
            All student quiz evaluations are recorded upon completion. Only 1 attempt is permitted per student per module. Records can be exported directly as a CSV file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-5 py-2.5 rounded-sm text-xs font-bold font-mono uppercase tracking-widest flex items-center space-x-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Scores CSV</span>
          </button>
          {currentUser.role === 'faculty' && scores.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-2.5 rounded-sm text-xs font-mono font-bold flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#1A1A1A]/10 p-5 rounded-sm space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/40 block">Total Quiz Attempts Recorded</span>
          <div className="text-3xl font-serif text-[#1A1A1A] font-bold">{totalAttempts}</div>
          <p className="text-[11px] text-[#1A1A1A]/60 font-mono">Stored in CSV local storage</p>
        </div>

        <div className="bg-white border border-[#1A1A1A]/10 p-5 rounded-sm space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/40 block">Average Class Percentage</span>
          <div className="text-3xl font-serif text-[#991b1b] font-bold">{avgPercentage}%</div>
          <p className="text-[11px] text-[#1A1A1A]/60 font-mono">Across all attempted modules</p>
        </div>

        <div className="bg-white border border-[#1A1A1A]/10 p-5 rounded-sm space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/40 block">Attempt Constraint</span>
          <div className="text-xl font-serif text-[#1A1A1A] font-bold flex items-center space-x-2 pt-1">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>1 Attempt / Student</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-mono">Enforced per USN & Module ID</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#F8F6F2] p-4 rounded-sm border border-[#1A1A1A]/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#1A1A1A]/50 shrink-0" />
          <span className="text-xs font-mono font-bold text-[#1A1A1A]">Module Filter:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedModule('all')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                selectedModule === 'all' ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70'
              }`}
            >
              All Modules
            </button>
            {[1, 2, 3, 4, 5].map(m => (
              <button
                key={m}
                onClick={() => setSelectedModule(m)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  selectedModule === m ? 'bg-[#991b1b] text-white' : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70'
                }`}
              >
                Mod {m}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by USN or Student Name..."
            className="w-full bg-white border border-[#1A1A1A]/20 pl-9 pr-3 py-1.5 rounded text-xs font-mono outline-none focus:border-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Scores Table */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-sm overflow-hidden shadow-xs">
        <div className="p-4 bg-[#1A1A1A] text-white flex justify-between items-center">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest font-bold">
            <Table className="w-4 h-4 text-[#991b1b]" />
            <span>Quiz Score Records ({filteredScores.length})</span>
          </div>
          <button
            onClick={loadScores}
            className="text-[11px] font-mono text-white/70 hover:text-white flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        {filteredScores.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#1A1A1A]/50 space-y-2">
            <FileSpreadsheet className="w-8 h-8 mx-auto text-[#1A1A1A]/30" />
            <p>No quiz score records found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-[#F8F6F2] border-b border-[#1A1A1A]/10 text-[#1A1A1A]/70 uppercase font-mono text-[10px] tracking-wider">
                  <th className="p-3.5">Student USN / ID</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Module</th>
                  <th className="p-3.5">Raw Score</th>
                  <th className="p-3.5">Percentage</th>
                  <th className="p-3.5">Completion Timestamp</th>
                  {currentUser.role === 'faculty' && <th className="p-3.5 text-right">Faculty Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10">
                {filteredScores.map(s => {
                  const isCurrent = s.userId === currentUser.id;
                  return (
                    <tr key={s.id} className={`hover:bg-[#F8F6F2]/50 transition-colors ${isCurrent ? 'bg-amber-50/50 font-medium' : ''}`}>
                      <td className="p-3.5 font-mono font-bold text-[#1A1A1A]">
                        {s.userId}
                        {isCurrent && <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-mono">You</span>}
                      </td>
                      <td className="p-3.5 font-serif text-[#1A1A1A] font-semibold">{s.userName}</td>
                      <td className="p-3.5 font-mono">
                        <span className="bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 px-2 py-0.5 rounded text-[11px]">
                          Module {s.moduleNumber}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#1A1A1A]">
                        {s.score} / {s.totalQuestions}
                      </td>
                      <td className="p-3.5 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.percentage >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.percentage}%
                        </span>
                      </td>
                      <td className="p-3.5 text-[#1A1A1A]/60 font-mono text-[11px]">
                        {s.timestamp}
                      </td>
                      {currentUser.role === 'faculty' && (
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleResetAttempt(s.id, s.userName, s.moduleNumber)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 text-[10px] font-mono font-bold flex items-center space-x-1 ml-auto"
                            title="Reset this student's attempt to let them retake"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Reset Attempt</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
