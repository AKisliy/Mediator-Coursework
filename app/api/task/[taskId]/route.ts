import { TaskManager } from '@/lib/task-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const task = TaskManager.getTask(params.taskId);

  if (!task) {
    return NextResponse.json({ status: 'pending' }, { status: 202 });
  }

  if (task.status === 'failed')
    return NextResponse.json({ error: task.error }, { status: 500 });

  TaskManager.removeTask(params.taskId);
  return NextResponse.json(task.result);
}
