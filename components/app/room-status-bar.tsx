'use client';

import React from 'react';
import { useRoomContext } from '@livekit/components-react';

export function RoomStatusBar() {
  const room = useRoomContext();

  if (!room) {
    return null;
  }

  return (
    <div className="bg-muted/50 flex items-center justify-between border-t px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Room:</span>
        <span className="font-mono">{room.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            room.state === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        />
        <span className="text-muted-foreground capitalize">{room.state}</span>
      </div>
    </div>
  );
}
