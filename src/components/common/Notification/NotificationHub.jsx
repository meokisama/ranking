export default function NotificationHub(notification, message, description) {
  notification.open({
    message,
    description,
    showProgress: true,
    placement: "bottomRight",
    duration: 8,
  });
}
