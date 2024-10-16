import type { Job } from 'bullmq';
import { escape } from 'sqlstring';

import { chQuery, db, TABLE_NAMES } from '@openpanel/db';
import type {
  EventsQueuePayload,
  EventsQueuePayloadCreateSessionEnd,
  EventsQueuePayloadIncomingEvent,
} from '@openpanel/queue';

import { createSessionEnd } from './events.create-session-end';
import { incomingEvent } from './events.incoming-event';

export async function eventsJob(job: Job<EventsQueuePayload>) {
  switch (job.data.type) {
    case 'incomingEvent': {
      return await incomingEvent(job as Job<EventsQueuePayloadIncomingEvent>);
    }
    case 'createSessionEnd': {
      try {
        await updateEventsCount(job.data.payload.projectId);
      } catch (e) {
        job.log('Failed to update count');
      }

      return await createSessionEnd(
        job as Job<EventsQueuePayloadCreateSessionEnd>
      );
    }
  }
}

async function updateEventsCount(projectId: string) {
  const res = await chQuery<{ count: number }>(
    `SELECT count(*) as count FROM ${TABLE_NAMES.events} WHERE project_id = ${escape(projectId)}`
  );
  const count = res[0]?.count;
  if (count) {
    await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        eventsCount: count,
      },
    });
  }
}
