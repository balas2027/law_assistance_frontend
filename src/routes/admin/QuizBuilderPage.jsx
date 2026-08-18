import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Topbar from '../../components/layout/Topbar';
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

  const adminAction = (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSaveDraft}
        disabled={loading}
        className="border border-gray-300 text-gray-700 font-bold text-[12px] uppercase tracking-wider px-4 py-1.5 rounded-sm hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Save Draft
      </button>
      <button
        onClick={handlePublish}
        disabled={loading}
        className="bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[12px] uppercase tracking-wider px-5 py-1.5 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
      >
        {loading ? 'Saving…' : 'Publish Changes'}
      </button>
    </div>
  );

  return (
    <div className="bg-[#fafbfc] text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <Topbar variant="admin" adminTitle={quizBuilder.header || 'Quiz Builder'} adminAction={adminAction} />
      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col pt-16 h-screen w-full min-w-0 bg-[#fafbfc] relative overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-8 w-full pb-24 bg-[#fafbfc]">
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
        </div>
      </main>
    </div>
  );
}