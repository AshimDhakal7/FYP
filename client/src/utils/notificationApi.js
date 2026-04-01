const API_BASE = "http://localhost:5001";

function getToken() {
  return localStorage.getItem("token");
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${API_BASE}/api/notifications/read-all`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return res.json();
}

export async function deleteNotification(id) {
  const res = await fetch(`${API_BASE}/api/notifications/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete notification");
  }

  return res.json();
}