import { Bell, Megaphone, Compass, Send, Users } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@components/base/tabs';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';
import matchesScope from '@utils/matchesScope';
import { TopicsSection } from './TopicsPage';
import { DiscoverTopicsSection } from './DiscoverTopicsPage';
import { NotificationsSection } from './NotificationsPage';
import { RecipientsSection } from './RecipientsPage';

type TabDef = {
  value: string;
  label: string;
  icon: React.ReactNode;
  scope: string;
  render: () => React.ReactNode;
};

const TAB_DEFS: TabDef[] = [
  {
    value: 'topics',
    label: 'Topics',
    icon: <Megaphone className='w-4 h-4' />,
    scope: 'was:topic:List',
    render: () => <TopicsSection />,
  },
  {
    value: 'discover',
    label: 'Discover',
    icon: <Compass className='w-4 h-4' />,
    scope: 'was:topic:List',
    render: () => <DiscoverTopicsSection />,
  },
  {
    value: 'sent',
    label: 'Sent',
    icon: <Send className='w-4 h-4' />,
    scope: 'was:notification:List',
    render: () => <NotificationsSection />,
  },
  {
    value: 'recipients',
    label: 'Recipients',
    icon: <Users className='w-4 h-4' />,
    scope: 'was:recipient:List',
    render: () => <RecipientsSection />,
  },
];

export default function NotificationsHubPage() {
  const [params, setParams] = useSearchParams();
  const { userScope, isSudo } = useAuthStore();

  const visibleTabs = TAB_DEFS.filter(
    (t) =>
      isSudo || userScope?.some((s) => matchesScope(s, t.scope)),
  );

  const raw = params.get('tab');
  const active =
    visibleTabs.find((t) => t.value === raw)?.value ??
    visibleTabs[0]?.value ??
    '';

  const setActive = (v: string) => {
    const next = new URLSearchParams(params);
    next.set('tab', v);
    setParams(next, { replace: true });
  };

  return (
    <div className='space-y-4'>
      <PageHeader title='Notifications' icon={<Bell className='w-5 h-5' />} />

      {visibleTabs.length === 0 ? (
        <div className='border border-destructive bg-destructive/20 text-destructive rounded-sm p-2'>
          Missing Permission
        </div>
      ) : (
        <Tabs value={active} onValueChange={setActive}>
          <div className='overflow-x-auto'>
            <TabsList>
              {visibleTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.icon}
                  <span className='hidden sm:inline'>{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {visibleTabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              {t.render()}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
