import { redirect } from 'next/navigation'

/** El portal usa una sola URL; conservamos /en/dashboard por enlaces compartidos */
export default function EnDashboardAlias() {
  redirect('/dashboard')
}
