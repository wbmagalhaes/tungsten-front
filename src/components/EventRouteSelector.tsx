import { Badge } from '@components/base/badge';
import { useTopics } from '@hooks/notifications/use-topics';
import { useListQueues } from '@hooks/queues/use-list-queues';
import { useAuthStore } from '@stores/useAuthStore';
import matchesScope from '@utils/matchesScope';

interface Props {
  topics: string[];
  queues: string[];
  onTopicsChange: (next: string[]) => void;
  onQueuesChange: (next: string[]) => void;
  label?: { topics: string; queues: string };
}

function useHasScope(scope: string) {
  const { isSudo, userScope } = useAuthStore();
  if (isSudo) return true;
  return userScope?.some((u) => matchesScope(u, scope)) ?? false;
}

export function EventRouteSelector({
  topics,
  queues,
  onTopicsChange,
  onQueuesChange,
  label = { topics: 'Event topics', queues: 'Event queues' },
}: Props) {
  const canListTopics = useHasScope('was:topic:List');
  const canListQueues = useHasScope('wqs:queue:List');

  const { data: topicsPage } = useTopics();
  const { data: queuesPage } = useListQueues({ page_size: 100 });
  const topicList = canListTopics ? (topicsPage?.results ?? []) : [];
  const queueList = canListQueues ? (queuesPage?.results ?? []) : [];

  const toggle = (
    arr: string[],
    id: string,
    setter: (next: string[]) => void,
  ) => {
    setter(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  if (!canListTopics && !canListQueues) return null;

  return (
    <div className='space-y-4'>
      {canListTopics && (
        <div>
          <p className='text-sm font-medium mb-1'>{label.topics}</p>
          {topicList.length === 0 ? (
            <p className='text-xs text-muted-fg'>
              No topics available.
            </p>
          ) : (
            <div className='flex flex-wrap gap-1.5'>
              {topicList.map((t) => {
                const active = topics.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type='button'
                    onClick={() => toggle(topics, t.id, onTopicsChange)}
                    className='cursor-pointer'
                  >
                    <Badge variant={active ? 'default' : 'outline'}>
                      {t.name}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {canListQueues && (
        <div>
          <p className='text-sm font-medium mb-1'>{label.queues}</p>
          {queueList.length === 0 ? (
            <p className='text-xs text-muted-fg'>
              No queues available.
            </p>
          ) : (
            <div className='flex flex-wrap gap-1.5'>
              {queueList.map((q) => {
                const active = queues.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type='button'
                    onClick={() => toggle(queues, q.id, onQueuesChange)}
                    className='cursor-pointer'
                  >
                    <Badge variant={active ? 'default' : 'outline'}>
                      {q.name}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
