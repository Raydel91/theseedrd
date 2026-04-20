import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'

/**
 * Archivo: solo nombre, teléfono y email tras leer el mensaje original (el cuerpo se elimina).
 */
export const ConsultationReadLogs: CollectionConfig = {
  slug: 'consultation-read-logs',
  labels: { singular: 'Registro leído', plural: 'Registros leídos' },
  admin: {
    group: 'Comunicación',
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'phone', 'email', 'replyActions', 'readAt', 'source'],
    description:
      'Se crea automáticamente al marcar un mensaje como leído. No contiene el texto del mensaje.',
  },
  access: {
    read: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Nombre del cliente',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Teléfono / WhatsApp',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'readAt',
      type: 'date',
      required: true,
      label: 'Leído el',
    },
    {
      name: 'readBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Leído por',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Origen',
      admin: {
        description: 'public_form o client_portal',
      },
    },
    {
      name: 'replyActions',
      type: 'ui',
      label: 'Contestar (WhatsApp / email)',
      admin: {
        components: {
          Field: './payload/admin/ConsultationReplyActions.tsx#ConsultationReplyActionsField',
          Cell: './payload/admin/ConsultationReplyActions.tsx#ConsultationReplyActionsCell',
        },
      },
    },
  ],
}
