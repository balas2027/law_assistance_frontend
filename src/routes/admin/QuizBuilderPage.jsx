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

        <header className="bg-surface-container-lowest text-primary border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-gutter h-16 sticky z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-on-surface-variant">
              <Icon name="menu" size={24} />
            </button>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Quiz Builder
              </span>
              <h2 className="font-h2 text-h2 font-bold text-primary truncate md:text-[24px]">{quizBuilder.header}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <button className="text-on-surface-variant hover:text-secondary transition-all p-2 rounded-full hover:bg-surface-container">
                <Icon name="notifications" size={20} />
              </button>
              <button className="text-on-surface-variant hover:text-secondary transition-all p-2 rounded-full hover:bg-surface-container">
                <Icon name="gavel" size={20} />
              </button>
            </div>
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="border border-outline-variant text-on-surface-variant font-label-caps text-label-caps px-6 py-2 rounded-full font-bold hover:bg-surface-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="bg-saffron text-on-primary font-label-caps text-label-caps px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : 'Publish Changes'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-margin-mobile md:p-gutter max-w-[1200px] w-full mx-auto overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-gutter items-start">
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
            <div className="mt-4 bg-error/10 border border-error/30 text-error rounded-xl px-5 py-3 flex items-center gap-2">
              <Icon name="error" size={18} />
              {error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}