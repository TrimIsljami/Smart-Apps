export async function requestNotificationPermission(): Promise<boolean> {
   if (!("Notification" in window)) return false;

   const permission = await Notification.requestPermission();
   return permission === "granted";
}

export function notify(message: string, options: NotificationOptions = {}): void {
   if (!("Notification" in window)) return;

   if (Notification.permission === "granted") {
      new Notification(message, options);
   }
}
