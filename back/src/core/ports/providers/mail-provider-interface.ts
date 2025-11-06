export interface AddressInterface {
  name: string;
  email: string;
}
export interface MessageInterface {
  to: AddressInterface;
  from: AddressInterface;
  subject: string;
  body: string;
}
export interface MailProviderInterface {
  sendMail(message: MessageInterface): Promise<void>;
}
