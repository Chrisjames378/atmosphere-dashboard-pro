/**
 * Resilient WebSocket Connection Manager
 * Provides auto-reconnection, health heartbeat checks, exponential backoff,
 * and graceful fallback handling for cloud & sandboxed container environments.
 */

export type SocketStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'FALLBACK';

export interface SocketManagerOptions {
  url?: string;
  heartbeatIntervalMs?: number;
  maxReconnectAttempts?: number;
  initialReconnectDelayMs?: number;
  maxReconnectDelayMs?: number;
  onStatusChange?: (status: SocketStatus, error?: string) => void;
  onMessage?: (data: any) => void;
}

export class SocketManager {
  private url: string;
  private ws: WebSocket | null = null;
  private status: SocketStatus = 'DISCONNECTED';
  private heartbeatIntervalMs: number;
  private maxReconnectAttempts: number;
  private initialReconnectDelayMs: number;
  private maxReconnectDelayMs: number;
  private reconnectAttempts = 0;
  private heartbeatTimer: any = null;
  private reconnectTimer: any = null;
  private isExplicitlyClosed = false;

  private onStatusChange?: (status: SocketStatus, error?: string) => void;
  private onMessage?: (data: any) => void;

  constructor(options: SocketManagerOptions = {}) {
    this.url = options.url || (typeof window !== 'undefined' ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws` : 'ws://localhost:3000/ws');
    this.heartbeatIntervalMs = options.heartbeatIntervalMs || 15000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.initialReconnectDelayMs = options.initialReconnectDelayMs || 1000;
    this.maxReconnectDelayMs = options.maxReconnectDelayMs || 16000;
    this.onStatusChange = options.onStatusChange;
    this.onMessage = options.onMessage;
  }

  /**
   * Connect to the WebSocket endpoint safely
   */
  public connect(): void {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    this.setStatus('CONNECTING');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.setStatus('CONNECTED');
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (this.onMessage) this.onMessage(parsed);
        } catch {
          if (this.onMessage) this.onMessage(event.data);
        }
      };

      this.ws.onerror = (err) => {
        // Silently capture socket errors to prevent unhandled console exceptions
        console.warn('[SocketManager] Handled websocket transport warning:', err);
      };

      this.ws.onclose = (event) => {
        this.stopHeartbeat();
        this.ws = null;

        if (this.isExplicitlyClosed) {
          this.setStatus('DISCONNECTED');
          return;
        }

        this.handleReconnect(event.reason || 'Transport closed');
      };
    } catch (err: any) {
      this.handleReconnect(err?.message || 'Connection initiation failed');
    }
  }

  /**
   * Send payload safely
   */
  public send(data: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        this.ws.send(payload);
        return true;
      } catch (e) {
        console.warn('[SocketManager] Failed to send socket payload:', e);
        return false;
      }
    }
    return false;
  }

  /**
   * Disconnect and cleanup resources
   */
  public disconnect(): void {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    this.clearReconnectTimer();

    if (this.ws) {
      try {
        this.ws.close(1000, 'User initiated disconnect');
      } catch {
        // Ignore close errors
      }
      this.ws = null;
    }

    this.setStatus('DISCONNECTED');
  }

  /**
   * Exponential backoff reconnection handler
   */
  private handleReconnect(reason: string): void {
    this.clearReconnectTimer();

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // Transition to FALLBACK mode gracefully
      this.setStatus('FALLBACK', `Connection unavailable (${reason}). Active fallback mode enabled.`);
      return;
    }

    this.reconnectAttempts++;
    this.setStatus('RECONNECTING', `Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}: ${reason}`);

    // Calculate backoff: min(maxDelay, initialDelay * 2^(attempts-1))
    const delay = Math.min(
      this.maxReconnectDelayMs,
      this.initialReconnectDelayMs * Math.pow(2, this.reconnectAttempts - 1)
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Heartbeat health check
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
        } catch {
          // Heartbeat failure handled in onclose
        }
      }
    }, this.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setStatus(newStatus: SocketStatus, error?: string): void {
    this.status = newStatus;
    if (this.onStatusChange) {
      this.onStatusChange(newStatus, error);
    }
  }

  public getStatus(): SocketStatus {
    return this.status;
  }
}
