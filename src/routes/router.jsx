import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './app/AppLayout';
import AdminLayout from './admin/AdminLayout';
import RequireAuth, { RequireRole } from './RequireAuth';
import ForbiddenPage from './ForbiddenPage';
import HomePage from './marketing/HomePage';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import ChatPage from './app/chat/ChatPage';
import ChatConversationPage from './app/chat/ChatConversationPage';
import AcademyDashboardPage from './app/academy/AcademyDashboardPage';
import AcademyPathPage from './app/academy/AcademyPathPage';

import LessonPage from './app/academy/LessonPage';
import QuizListPage from './app/academy/QuizListPage';
import QuizPage from './app/academy/QuizPage';
import SupportPage from './app/support/SupportPage';
import DashboardPage from './admin/DashboardPage';
import QuizManagerPage from './admin/QuizManagerPage';
import QuizBuilderPage from './admin/QuizBuilderPage';
import ContentCMSPage from './admin/ContentCMSPage';
import LessonFormPage from './admin/LessonFormPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/chat', element: <ChatPage /> },
      { path: '/chat/:chatId', element: <ChatConversationPage /> },
      { path: '/support', element: <SupportPage /> },
      {
        element: (
          <RequireRole roles={['common_man', 'admin']}>
            <Outlet />
          </RequireRole>
        ),
        children: [
          { path: '/academy/dashboard', element: <AcademyDashboardPage /> },
          { path: '/academy/path', element: <AcademyPathPage /> },
          { path: '/academy/path/:courseId', element: <AcademyPathPage /> },
          { path: '/academy/lesson/:lessonId', element: <LessonPage /> },
          { path: '/academy/quiz', element: <QuizListPage /> },
          { path: '/academy/quiz/:quizId', element: <QuizPage /> },
        ],
      },
    ],
  },

  {
    element: (
      <RequireRole roles={['admin']} orSuperuser>
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { path: '/admin/dashboard',              element: <DashboardPage /> },
      { path: '/admin/cms',                    element: <ContentCMSPage /> },
      { path: '/admin/cms/lessons/new',        element: <LessonFormPage /> },
      { path: '/admin/cms/lessons/:lessonId/edit', element: <LessonFormPage /> },
      { path: '/admin/quiz-builder',           element: <QuizManagerPage /> },
      { path: '/admin/quiz-builder/:id',       element: <QuizBuilderPage /> },
    ],
  },
  { path: '/forbidden', element: <ForbiddenPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);