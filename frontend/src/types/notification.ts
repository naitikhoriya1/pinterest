export interface Notification {
  _id: string;
  type: "NEW_PIN";
  actor: string;
  pin: string;
  actorName: string;
  actorAvatar?: string;
  pinTitle: string;
  pinImageUrl: string;
  createdAt: string;
  isRead: boolean;
}
