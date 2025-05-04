let currentUserId: string | null = null;

export function setContextUserId(userId: string | null) {
  currentUserId = userId;
}

export function getContextUserId(): string {
  if (!currentUserId) {
    throw new Error('User not authenticated');
  }
  return currentUserId;
}
