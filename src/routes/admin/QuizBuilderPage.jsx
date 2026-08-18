import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import QuizBuilderForm from '../../components/features/admin/QuizBuilderForm';
import QuizSettingsPanel from '../../components/features/admin/QuizSettingsPanel';
import Icon from '../../components/ui/Icon';
import { useAdminStore } from '../../stores/adminStore';
import { useUiStore } from '../../stores/uiStore';

export default function QuizBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();
  const { quizBuilder, topics, loading, error, loadQuizBuilder, loadTopics, setBuilderField, addQuestion, removeQuestion, setQuestionScenario, setQuestionPoints, addQuestionOption, removeQuestionOption, setQuestionOptionText, setQuestionCorrectOption, addCitation, removeCitation, saveQuizBuilder, publishQuizBuilder } =
    useAdminStore();

  const isNew = !id || id === 'new' || id === 'demo';

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  useEffect(() => {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) return;
    if (id !== String(quizBuilder.id)) {
      loadQuizBuilder(id);
    }
  }, [id, quizBuilder.id, loadQuizBuilder]);

  const afterSave = (saved) => {
    if (isNew) {
      navigate(`/admin/quiz-builder/${saved.id}`, { replace: true });
    }
  };

  const handlePublish = async () => {
    try {
      const saved = await publishQuizBuilder();
      afterSave(saved);
    } catch {
      // failure toast handled in the store
    }
  };

  const handleSaveDraft = async () => {
    try {
      const saved = await saveQuizBuilder();
      afterSave(saved);
    } catch {
      // failure toast handled in the store
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >

        <header className="bg-white border-b border-gray-200/90 shadow-xs flex justify-between items-center w-full px-8 h-16 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold shadow-xs">
              <Icon name="quiz" size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Quiz Builder</p>
              <h2 className="text-[17px] font-bold text-gray-950 truncate">{quizBuilder.header || 'Configure Quiz'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="border border-gray-300 text-gray-700 font-bold text-[12.5px] uppercase tracking-wider px-5 py-2 rounded-sm hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[12.5px] uppercase tracking-wider px-6 py-2 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              {loading ? 'Saving…' : 'Publish Changes'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[1280px] w-full mx-auto overflow-y-auto bg-[#fafbfc]">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <QuizBuilderForm
              quiz={quizBuilder}
              onFieldChange={setBuilderField}
              onAddQuestion={addQuestion}
              onRemoveQuestion={removeQuestion}
              onQuestionScenarioChange={setQuestionScenario}
              onQuestionPointsChange={setQuestionPoints}
              onAddOption={addQuestionOption}
              onRemoveOption={removeQuestionOption}
              onOptionTextChange={setQuestionOptionText}
              onCorrectChange={setQuestionCorrectOption}
            />
            <QuizSettingsPanel
              quiz={quizBuilder}
              topics={topics}
              onFieldChange={setBuilderField}
              onAddCitation={addCitation}
              onRemoveCitation={removeCitation}
            />
          </div>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-sm px-5 py-3 flex items-center gap-2 text-[13px]">
              <Icon name="error" size={18} />
              {error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}