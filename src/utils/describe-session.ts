import { UAParser } from 'ua-parser-js';
import { SmartphoneIcon, TabletIcon, MonitorIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

interface SessionDescription {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export function describeSession(userAgent: string | null): SessionDescription {
  if (!userAgent) {
    return { label: 'Unknown device', Icon: MonitorIcon };
  }

  const ua = new UAParser(userAgent).getResult();
  const browser = ua.browser.name ?? 'Unknown browser';
  const os = ua.os.name ?? '';
  const deviceType = ua.device.type;

  const Icon =
    deviceType === 'mobile'
      ? SmartphoneIcon
      : deviceType === 'tablet'
        ? TabletIcon
        : MonitorIcon;

  const label = os ? `${browser} on ${os}` : browser;

  return { label, Icon };
}
