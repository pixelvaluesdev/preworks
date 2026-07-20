import ApiManager from '../apis/ApiManager';

interface SendNotificationProps {
  professionalId: string;
  notificationType: string;
  userId: string;
  token: string;
  projectName?: string;
  city?: string;
  projectId?: string;
}

const sendNotification = async ({
  professionalId,
  notificationType,
  userId,
  token,
  projectName = '',
  city = '',
  projectId = '',
}: SendNotificationProps) => {
  try {
    const res = await ApiManager.sendNotification(
      {
        id: userId,
        professionalId,
        notificationType,
        projectName,
        city,
        projectId,
      },
      token,
    );

    console.log('Notification Sent:', res?.data);
  } catch (err) {
    console.log('Notification Error:', err);
  }
};

export default sendNotification;
