// import React, { useEffect, useRef, useState } from "react";
// import {
//   fetchNotifications,
//   markNotificationRead,
//   markAllNotificationsRead,
//   deleteNotification,
// } from "../utils/notificationApi";
// import { Bell, CheckCheck, Trash2, X } from "lucide-react";

// export default function NotificationBell({ variant = "light" }) {
//   const isDark = variant === "dark";

//   const [open, setOpen] = useState(false);
//   const [items, setItems] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const dropdownRef = useRef(null);

//   const loadNotifications = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchNotifications();
//       setItems(data.notifications || []);
//       setUnreadCount(data.unreadCount || 0);
//     } catch (error) {
//       console.error("Failed to load notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         event.target instanceof Node &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleRead = async (id) => {
//     try {
//       await markNotificationRead(id);
//       await loadNotifications();
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

//   const handleReadAll = async () => {
//     try {
//       await markAllNotificationsRead();
//       await loadNotifications();
//     } catch (error) {
//       console.error("Failed to mark all notifications as read:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteNotification(id);
//       await loadNotifications();
//     } catch (error) {
//       console.error("Failed to delete notification:", error);
//     }
//   };

//   const triggerClass = isDark
//     ? "h-10 w-10 rounded-full border border-white/15 bg-slate-800 text-white shadow-sm hover:bg-slate-700"
//     : "h-10 w-10 rounded-full border border-gray-300 bg-gray-50 text-gray-800 shadow-sm hover:bg-green-50 hover:border-green-300 hover:text-green-700";

//   const dropdownClass = isDark
//     ? "border-white/10 bg-slate-950 text-white shadow-black/40"
//     : "border-gray-200 bg-white text-gray-900 shadow-gray-200/70";

//   const headerBorderClass = isDark ? "border-white/10" : "border-gray-200";

//   const subTextClass = isDark ? "text-slate-400" : "text-gray-500";
//   const titleTextClass = isDark ? "text-white" : "text-gray-900";
//   const messageTextClass = isDark ? "text-slate-300" : "text-gray-600";
//   const dateTextClass = isDark ? "text-slate-500" : "text-gray-400";

//   const softButtonClass = isDark
//     ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
//     : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900";

//   const markAllClass = isDark
//     ? "border-white/10 bg-white/5 text-emerald-300 hover:bg-white/10"
//     : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100";

//   const readItemClass = isDark
//     ? "border-white/10 bg-white/5"
//     : "border-gray-200 bg-gray-50";

//   const unreadItemClass = isDark
//     ? "border-emerald-400/20 bg-emerald-400/10"
//     : "border-green-200 bg-green-50";

//   const emptyClass = isDark
//     ? "border-white/10 bg-white/[0.03] text-slate-400"
//     : "border-gray-200 bg-gray-50 text-gray-500";

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         aria-label="Open notifications"
//         title="Notifications"
//         className={`relative grid place-items-center transition ${triggerClass}`}
//       >
//         <Bell
//           size={18}
//           className={
//             unreadCount > 0
//               ? "text-green-600"
//               : isDark
//               ? "text-white"
//               : "text-gray-700"
//           }
//         />

//         {unreadCount > 0 && (
//           <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div
//           className={`absolute right-0 z-50 mt-3 w-[380px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border shadow-2xl ${dropdownClass}`}
//         >
//           <div
//             className={`flex items-center justify-between border-b px-4 py-4 ${headerBorderClass}`}
//           >
//             <div>
//               <h3 className={`text-sm font-semibold ${titleTextClass}`}>
//                 Notifications
//               </h3>
//               <p className={`mt-1 text-xs ${subTextClass}`}>
//                 {unreadCount > 0
//                   ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
//                   : "All caught up"}
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={handleReadAll}
//                 className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium transition ${markAllClass}`}
//               >
//                 <CheckCheck size={14} />
//                 Mark all
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className={`grid h-9 w-9 place-items-center rounded-xl border transition ${softButtonClass}`}
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>

//           <div className="max-h-[420px] overflow-y-auto p-4">
//             {loading ? (
//               <div className={`rounded-2xl border p-4 text-sm ${emptyClass}`}>
//                 Loading notifications...
//               </div>
//             ) : items.length ? (
//               <div className="space-y-3">
//                 {items.map((item) => (
//                   <div
//                     key={item._id}
//                     className={`rounded-2xl border p-4 transition ${
//                       item.isRead ? readItemClass : unreadItemClass
//                     }`}
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="min-w-0 flex-1">
//                         <h4 className={`truncate text-sm font-semibold ${titleTextClass}`}>
//                           {item.title}
//                         </h4>
//                         <p className={`mt-1 text-xs leading-5 ${messageTextClass}`}>
//                           {item.message}
//                         </p>
//                         <p className={`mt-2 text-[11px] ${dateTextClass}`}>
//                           {new Date(item.createdAt).toLocaleString()}
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => handleDelete(item._id)}
//                         className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition ${softButtonClass}`}
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>

//                     {!item.isRead && (
//                       <button
//                         type="button"
//                         onClick={() => handleRead(item._id)}
//                         className="mt-3 inline-flex items-center rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
//                       >
//                         Mark as read
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className={`rounded-2xl border border-dashed p-6 text-center text-sm ${emptyClass}`}>
//                 No notifications yet.
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../utils/notificationApi";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";

export default function NotificationBell({
  variant = "light",
  role = "user",
}) {
  const isDark = variant === "dark";
  const isOwner = role === "owner";

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setItems(Array.isArray(data?.notifications) ? data.notifications : []);
      setUnreadCount(data?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [role]);

  useEffect(() => {
    const handleAuthChanged = () => {
      loadNotifications();
    };

    window.addEventListener("authChanged", handleAuthChanged);
    window.addEventListener("userUpdated", handleAuthChanged);

    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("userUpdated", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      await loadNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await loadNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const triggerClass = isDark
    ? "h-10 w-10 rounded-full border border-white/15 bg-slate-800 text-white shadow-sm hover:bg-slate-700"
    : "h-10 w-10 rounded-full border border-gray-300 bg-gray-50 text-gray-800 shadow-sm hover:bg-green-50 hover:border-green-300 hover:text-green-700";

  const dropdownClass = isDark
    ? "border-white/10 bg-slate-950 text-white shadow-black/40"
    : "border-gray-200 bg-white text-gray-900 shadow-gray-200/70";

  const headerBorderClass = isDark ? "border-white/10" : "border-gray-200";
  const subTextClass = isDark ? "text-slate-400" : "text-gray-500";
  const titleTextClass = isDark ? "text-white" : "text-gray-900";
  const messageTextClass = isDark ? "text-slate-300" : "text-gray-600";
  const dateTextClass = isDark ? "text-slate-500" : "text-gray-400";

  const softButtonClass = isDark
    ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  const markAllClass = isDark
    ? "border-white/10 bg-white/5 text-emerald-300 hover:bg-white/10"
    : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100";

  const readItemClass = isDark
    ? "border-white/10 bg-white/5"
    : "border-gray-200 bg-gray-50";

  const unreadItemClass = isDark
    ? "border-emerald-400/20 bg-emerald-400/10"
    : "border-green-200 bg-green-50";

  const emptyClass = isDark
    ? "border-white/10 bg-white/[0.03] text-slate-400"
    : "border-gray-200 bg-gray-50 text-gray-500";

  const heading = isOwner ? "Owner Notifications" : "Notifications";
  const emptyText = isOwner
    ? "No owner notifications yet."
    : "No notifications yet.";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open notifications"
        title={heading}
        className={`relative grid place-items-center transition ${triggerClass}`}
      >
        <Bell
          size={18}
          className={
            unreadCount > 0
              ? "text-green-600"
              : isDark
              ? "text-white"
              : "text-gray-700"
          }
        />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 mt-3 w-[380px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border shadow-2xl ${dropdownClass}`}
        >
          <div
            className={`flex items-center justify-between border-b px-4 py-4 ${headerBorderClass}`}
          >
            <div>
              <h3 className={`text-sm font-semibold ${titleTextClass}`}>
                {heading}
              </h3>
              <p className={`mt-1 text-xs ${subTextClass}`}>
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReadAll}
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium transition ${markAllClass}`}
              >
                <CheckCheck size={14} />
                Mark all
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`grid h-9 w-9 place-items-center rounded-xl border transition ${softButtonClass}`}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-4">
            {loading ? (
              <div className={`rounded-2xl border p-4 text-sm ${emptyClass}`}>
                Loading notifications...
              </div>
            ) : items.length ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className={`rounded-2xl border p-4 transition ${
                      item.isRead ? readItemClass : unreadItemClass
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className={`truncate text-sm font-semibold ${titleTextClass}`}>
                          {item.title}
                        </h4>
                        <p className={`mt-1 text-xs leading-5 ${messageTextClass}`}>
                          {item.message}
                        </p>
                        <p className={`mt-2 text-[11px] ${dateTextClass}`}>
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition ${softButtonClass}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={() => handleRead(item._id)}
                        className="mt-3 inline-flex items-center rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-2xl border border-dashed p-6 text-center text-sm ${emptyClass}`}>
                {emptyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}