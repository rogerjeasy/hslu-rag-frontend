import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(url: string, token: string): Socket {
    if (!this.socket) {
      this.socket = io(url, {
        auth: {
          token,
        },
        transports: ['websocket'],
      });
      console.log('Socket connected');
    }
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected');
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export default SocketService;