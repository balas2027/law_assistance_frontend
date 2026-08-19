import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Tooltip, IconButton } from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import PublishOutlined from '@mui/icons-material/PublishOutlined';
import UnpublishedOutlined from '@mui/icons-material/UnpublishedOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Topbar from '../../components/layout/Topbar';
import Icon from '../../components/ui/Icon';
import { useCmsStore } from '../../stores/cmsStore';
import { useUiStore } from '../../stores/uiStore';

// ── Status Chip ─────────────────────────────────────────────────
function StatusChip({ status, onClick }) {
  const isPublished = status === 'published';
  return (
    <Chip
      label={isPublished ? 'Published' : 'Draft'}
      size="small"
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        bgcolor: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
        color: isPublished ? '#059669' : '#d97706',
        border: `1px solid ${isPublished ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
        '&:hover': onClick
          ? {
            bgcolor: isPublished ? 'rgba(16, 185, 129, 0.22)' : 'rgba(245, 158, 11, 0.22)',
          }
          : {},
        '& .MuiChip-label': { px: 1.5 },
      }}
    />
  );
}

// ── Stat Card ───────────────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div className={`bg-white border border-gray-200/90 rounded-xl p-4 shadow-sm flex items-center gap-4 ${color}`}>
      <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center shrink-0">
        <span className="text-[22px] leading-none">{icon}</span>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className="text-[24px] font-bold text-gray-950 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function CourseLessonsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    courses,
    lessons,
    lessonsLoading,
    error,
    loadCourses,
    loadLessons,
    updateLesson,
    deleteLesson,
  } = useCmsStore();
  const { sidebarCollapsed } = useUiStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    loadCourses();
    loadLessons(courseId ? Number(courseId) : undefined);
  }, [courseId, loadCourses, loadLessons]);

  const course = useMemo(
    () => courses.find((c) => String(c.id) === String(courseId)),
    [courses, courseId]
  );

  const filteredLessons = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return lessons.filter(
      (l) =>
        l.title?.toLowerCase().includes(q) ||
        l.status?.toLowerCase().includes(q)
    );
  }, [lessons, searchQuery]);

  const publishedCount = lessons.filter((l) => l.status === 'published').length;
  const draftCount = lessons.filter((l) => l.status === 'draft').length;

  const handleToggleStatus = async (lesson) => {
    const nextStatus = lesson.status === 'published' ? 'draft' : 'published';
    try {
      await updateLesson(lesson.id, { status: nextStatus });
    } catch {
      /* handled in store */
    }
  };

  const handleDelete = async (lessonId) => {
    if (!confirm('Delete this lesson permanently?')) return;
    try {
      await deleteLesson(lessonId);
    } catch {
      /* handled in store */
    }
  };

  // ── DataGrid Columns ────────────────────────────────────────
  const columns = [
    {
      field: 'order',
      headerName: '#',
      width: 64,
      sortable: false,
      renderCell: (params) => (
        <span className="text-[13px] text-gray-400 font-bold tabular-nums">
          {String(params.row.order ?? params.api.getAllRowIds().indexOf(params.id) + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      field: 'title',
      headerName: 'TITLE',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-lg bg-[#eaf1fc] flex items-center justify-center shrink-0">
            <MenuBookOutlined sx={{ fontSize: 16, color: '#0b57d0' }} />
          </div>
          <span className="text-[13.5px] font-semibold text-gray-900 line-clamp-1">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 130,
      renderCell: (params) => (
        <StatusChip
          status={params.value}
          onClick={() => handleToggleStatus(params.row)}
        />
      ),
    },
    {
      field: 'lesson_type',
      headerName: 'TYPE',
      width: 110,
      renderCell: (params) => (
        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2.5 py-0.5 rounded-full">
          {params.value || 'Standard'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          <Tooltip title={params.row.status === 'published' ? 'Set as Draft' : 'Publish'} arrow placement="top">
            <IconButton
              size="small"
              onClick={() => handleToggleStatus(params.row)}
              sx={{
                color: params.row.status === 'published' ? '#d97706' : '#059669',
                '&:hover': { bgcolor: params.row.status === 'published' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)' },
              }}
            >
              {params.row.status === 'published' ? (
                <UnpublishedOutlined sx={{ fontSize: 17 }} />
              ) : (
                <PublishOutlined sx={{ fontSize: 17 }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Lesson" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => navigate(`/admin/cms/lessons/${params.row.id}/edit`)}
              sx={{ color: '#4b5563', '&:hover': { color: '#0b57d0', bgcolor: '#eaf1fc' } }}
            >
              <EditOutlined sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Lesson" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: '#4b5563', '&:hover': { color: '#dc2626', bgcolor: 'rgba(220, 38, 38, 0.08)' } }}
            >
              <DeleteOutlined sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const adminAction = (
    <button
      id="cms-new-lesson-btn"
      onClick={() => navigate(`/admin/cms/lessons/new?courseId=${courseId}`)}
      className="flex items-center gap-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white px-4 py-1.5 rounded-lg text-[12.5px] font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
    >
      <AddOutlined sx={{ fontSize: 16 }} />
      <span>Add Lesson</span>
    </button>
  );

  return (
    <div className="bg-[#fafbfc] text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <Topbar variant="admin" adminTitle={course?.title || 'Lessons'} adminAction={adminAction} />
      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col pt-16 h-screen w-full min-w-0 bg-[#fafbfc] relative overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
          }`}
      >
        <div className="flex-1 overflow-y-auto px-8 py-8 pb-12 w-full">

          {/* Breadcrumb + Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-2">
              <button
                onClick={() => navigate('/admin/cms')}
                className="hover:text-[#0b57d0] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Icon name="library_books" size={13} className="text-gray-400" />
                Courses
              </button>
              <Icon name="chevron_right" size={14} className="text-gray-300" />
              <span className="text-gray-700 font-semibold">{course?.title || `Course #${courseId}`}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <button
                    onClick={() => navigate('/admin/cms')}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-[#0b57d0] transition-colors text-[13px] font-medium cursor-pointer"
                  >
                    <ArrowBackOutlined sx={{ fontSize: 18 }} />
                    Back to Courses
                  </button>
                </div>
                <h1 className="text-[26px] font-bold text-gray-950 tracking-tight flex items-center gap-3">
                  {course?.title || 'Lessons'}
                  {course?.status && (
                    <StatusChip status={course.status} />
                  )}
                </h1>
                <p className="text-[13.5px] text-gray-500 mt-1">
                  {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} in this course
                </p>
              </div>
            </div>
          </div>

          {/* Stat Cards Row */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {[
              {
                label: "Total Lessons",
                value: lessons.length,
                icon: "library_books",
                desc: "All available lessons",
              },
              {
                label: "Published Lessons",
                value: publishedCount,
                icon: "published_with_changes",
                desc: "Currently published lessons",
              },
              {
                label: "Draft Lessons",
                value: draftCount,
                icon: "edit_note",
                desc: "Lessons saved as drafts",
              },
            ].map(({ label, value, icon, desc }) => (
              <div
                key={label}
                className="w-full flex items-center justify-between bg-[#fafbfc] hover:bg-[#eaf1fc] border border-gray-200/70 hover:border-[#0b57d0]/30 transition-all rounded-sm px-4 py-3.5 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-white border border-gray-200/80 flex items-center justify-center text-[#0b57d0] shrink-0 shadow-2xs group-hover:bg-[#0b57d0] group-hover:text-white transition-colors">
                    <Icon name={icon} size={18} />
                  </div>

                  <div>
                    <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#0b57d0] transition-colors">
                      {label}
                    </p>

                    <p className="text-[12px] text-gray-500">
                      {desc}
                    </p>
                  </div>
                </div>

                <span className="text-[18px] font-bold text-gray-900">
                  {(value ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>


          {/* Error Banner */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-[13px] flex items-center gap-2">
              <Icon name="error" size={18} />
              {error}
            </div>
          )}

          {/* DataGrid Table */}
          <div className="bg-white border border-gray-200/90 rounded-xl shadow-sm overflow-hidden">
            {/* Table Toolbar: Search + Filter */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="relative w-72">
                <SearchOutlined
                  sx={{ fontSize: 17, color: '#9ca3af' }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lessons..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <span className="font-semibold">{filteredLessons.length}</span>
                <span>of {lessons.length} lessons</span>
              </div>
            </div>

            <DataGrid
              rows={filteredLessons}
              columns={columns}
              loading={lessonsLoading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row.id}
              sx={{
                border: 'none',
                fontFamily: '"Inter", sans-serif',
                fontSize: '13.5px',
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: '#f8f9fb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                },
                '& .MuiDataGrid-columnHeader': {
                  px: 2.5,
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                  px: 2.5,
                  color: '#374151',
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: '#f9fafb',
                },
                '& .MuiDataGrid-row.Mui-selected': {
                  bgcolor: '#eaf1fc',
                  '&:hover': { bgcolor: '#dce8fa' },
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid #e5e7eb',
                  bgcolor: '#f8f9fb',
                  minHeight: '44px',
                },
                '& .MuiDataGrid-overlay': {
                  bgcolor: 'transparent',
                },
                '& .MuiTablePagination-root': {
                  fontSize: '12.5px',
                  color: '#6b7280',
                },
              }}
              slots={{
                noRowsOverlay: () => (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#eaf1fc] flex items-center justify-center mb-4">
                      <MenuBookOutlined sx={{ fontSize: 28, color: '#0b57d0' }} />
                    </div>
                    <p className="text-[16px] font-bold text-gray-800 mb-1">No Lessons Yet</p>
                    <p className="text-[13px] text-gray-500 mb-5">
                      Add your first lesson to this course.
                    </p>
                    <button
                      onClick={() => navigate(`/admin/cms/lessons/new?courseId=${courseId}`)}
                      className="flex items-center gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white px-5 py-2 rounded-lg text-[13px] font-bold transition-colors cursor-pointer"
                    >
                      <AddOutlined sx={{ fontSize: 17 }} />
                      Add First Lesson
                    </button>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
