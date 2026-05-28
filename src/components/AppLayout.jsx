import { Outlet } from 'react-router-dom';
import { AppShell } from '../ui';

const navItems = [
  { to: '/demo', label: 'AI Demo' },
  { to: '/schema-demo', label: 'Schema Demo' },
  { to: '/gallery', label: '组件库' },
  { to: '/prototype', label: 'Prototype' },
  { to: '/screen-map', label: 'Screen Map' },
  { to: '/design-export', label: 'Design Export' },
  { to: '/map', label: 'Map (旧)' },
  { to: '/doc', label: 'Interaction Doc' },
];

export default function AppLayout() {
  return (
    <AppShell brand="AI 合同录入助手" brandSub="Demo" navItems={navItems}>
      <Outlet />
    </AppShell>
  );
}
