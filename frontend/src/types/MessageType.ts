// MessageType.ts

export default interface MessageType {
  id: string;
  message: string;
  sender: 'user' | 'ai';
}
