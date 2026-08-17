import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import QuizBuilderForm from '../../components/features/admin/QuizBuilderForm';
import QuizSettingsPanel from '../../components/features/admin/QuizSettingsPanel';
import Icon from '../../components/ui/Icon';
import { useAdminStore } from '../../stores/adminStore';

export default function QuizBuilderPage() {
  const { id } = useParams();
  const { quizBuilder, loadQuizBuilder, setBuilderField, setBuilderOption, setCorrectOption, addBuilderOption, addCitation, removeCitation, saveQuizBuilder } =
    useAdminStore();

  useEffect(() => {
    if (id && id !== quizBuilder.id) {
      loadQuizBuilder(id);
    }
  }, [id, quizBuilder.id, loadQuizBuilder]);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
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
              onClick={saveQuizBuilder}
              className="bg-saffron text-on-primary font-label-caps text-label-caps px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              Publish Changes
            </button>
          </div>
        </header>

        <main className="flex-1 p-margin-mobile md:p-gutter max-w-[1200px] w-full mx-auto overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-gutter items-start">
            <QuizBuilderForm
              quiz={quizBuilder}
              onFieldChange={setBuilderField}
              onOptionTextChange={setBuilderOption}
              onCorrectChange={setCorrectOption}
              onAddOption={addBuilderOption}
            />
            <QuizSettingsPanel
              quiz={quizBuilder}
              onFieldChange={setBuilderField}
              onAddCitation={addCitation}
              onRemoveCitation={removeCitation}
            />
          </div>
        </main>
      </div>
    </div>
  );
}