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
import AcademyPathPage from './app/academy/AcademyPathPage';
import LessonPage from './app/academy/LessonPage';
import QuizPage from './app/academy/QuizPage';
import DashboardPage from './admin/DashboardPage';
import QuizBuilderPage from './admin/QuizBuilderPage';

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
      {
        element: (
          <RequireRole roles={['law_student', 'researcher', 'law_professional', 'admin']}>
            <Outlet />
          </RequireRole>
        ),
        children: [
          { path: '/academy/path/:courseId', element: <AcademyPathPage /> },
          { path: '/academy/lesson/:lessonId', element: <LessonPage /> },
          { path: '/academy/quiz/:quizId', element: <QuizPage /> },
        ],
      },
    ],
  },
  {
    element: (
      <RequireRole roles={['law_professional', 'admin']} orSuperuser>
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { path: '/admin/dashboard', element: <DashboardPage /> },
      { path: '/admin/quiz-builder/:id', element: <QuizBuilderPage /> },
    ],
  },
  { path: '/forbidden', element: <ForbiddenPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);