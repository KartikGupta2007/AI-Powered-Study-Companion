import { useState, useCallback, useContext, useMemo } from 'react';
import { StudyContext } from '../context/StudyContext';

const useProgress = () => {
  const { tasks, topics, revisions } = useContext(StudyContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const progress = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    // Treat any non-completed task as pending to keep metrics consistent with current task flow.
    const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
    const revisionTasks = revisions.filter((r) => !r.completed).length;

    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const topicsByStatus = {
      'Not Started': topics.filter((t) => t.status === 'Not Started').length,
      'In Progress': topics.filter((t) => t.status === 'In Progress').length,
      Completed: topics.filter((t) => t.status === 'Completed').length,
      'Needs Revision': topics.filter((t) => t.status === 'Needs Revision').length,
    };

    const weekDayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
    const today = new Date();
    const weeklyProductivity = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toDateString();
      const completedForDay = tasks.filter((task) => {
        if (task.status !== 'Completed') return false;
        const sourceDate = task.completedAt || task.deadline;
        if (!sourceDate) return false;
        const parsed = new Date(sourceDate);
        if (Number.isNaN(parsed.getTime())) return false;
        return parsed.toDateString() === key;
      }).length;

      return {
        name: weekDayFormat.format(date),
        value: completedForDay,
      };
    });

    const upcomingRevisions = revisions
      .filter((revision) => !revision.completed && revision.revisionDate)
      .map((revision) => ({
        ...revision,
        revisionDateObj: new Date(revision.revisionDate),
      }))
      .filter((revision) => !Number.isNaN(revision.revisionDateObj.getTime()))
      .sort((a, b) => a.revisionDateObj.getTime() - b.revisionDateObj.getTime())
      .slice(0, 5);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      revisionTasks,
      completionPercentage,
      topicsByStatus,
      weeklyProductivity,
      upcomingRevisions,
    };
  }, [tasks, topics, revisions]);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { progress, loading, error, fetchProgress };
};

export default useProgress;
