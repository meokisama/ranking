export default function NotificationHub(notification, message, description) {
  notification.open({
    message,
    description,
    showProgress: true,
    pauseOnHover: false,
    placement: "bottomRight",
    duration: 8,
  });
}
