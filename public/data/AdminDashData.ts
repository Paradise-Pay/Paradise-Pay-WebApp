// public/data/DashboardData.ts
import { BsPeople, BsCalendarEvent, BsTicketPerforated, BsCurrencyDollar, BsBoxSeam, BsQrCodeScan } from 'react-icons/bs';

export const dashboardStats = [
  {
    label: 'Active Users',
    value: '24,500',
    helpText: '+125 new this week',
    trend: 'up', // 'up' | 'down' | 'neutral'
    icon: BsPeople,
    color: 'blue'
  },
  {
    label: 'Live Events',
    value: '14',
    helpText: '3 ending tonight',
    trend: 'neutral',
    icon: BsCalendarEvent,
    color: 'purple'
  },
  {
    label: 'Tickets Sold',
    value: '1,890',
    helpText: '145 sold today',
    trend: 'up',
    icon: BsTicketPerforated,
    color: 'green'
  },
  {
    label: 'Total Revenue',
    value: 'GH₵ 450k',
    helpText: 'Net: GH₵ 42k',
    trend: 'up',
    icon: BsCurrencyDollar,
    color: 'yellow' // Gold for money
  },
  {
    label: 'Active Bundles',
    value: '342',
    helpText: '85 redeemed today',
    trend: 'down',
    icon: BsBoxSeam,
    color: 'pink'
  },
  {
    label: 'Venue Scans',
    value: '8,900',
    helpText: 'Live check-ins',
    trend: 'up',
    icon: BsQrCodeScan,
    color: 'teal'
  }
];