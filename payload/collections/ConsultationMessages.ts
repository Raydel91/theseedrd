import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin, isPortalClient } from '@/payload/access/user-helpers'

export const ConsultationMessages: CollectionConfig = {
  slug: 'consultation-messages',
  labels: { singular: 'Mensaje de consulta', plural: 'Mensajes de consulta' },
  admin: {
    group: 'Comunicación',
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'name', 'email', 'phone', 'replyActions', 'source', 'createdAt', 'readAt'],
    description:
      'Formulario web o portal cliente. Para archivar: rellena «Leído el» y guarda; el texto se elimina y queda solo el registro en «Registros leídos».',
  },
  access: {
    read: ({ req }) => {
      const u = req.user as User | undefined
      if (canAccessPayloadAdmin(u)) return true
      if (u && isPortalClient(u)) {
        return {
          fromUser: {
            equals: u.id,
          },
        }
      }
      return false
    },
    create: () => false,
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    delete: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      label: 'Origen',
      options: [
        { label: 'Formulario web', value: 'public_form' },
        { label: 'Portal cliente', value: 'client_portal' },
      ],
    },
    {
      name: 'fromUser',
      type: 'relationship',
      relationTo: 'users',
      label: 'Cliente (portal)',
      admin: {
        description: 'Solo si el mensaje viene del área de cliente.',
      },
      filterOptions: {
        accountKind: {
          equals: 'client',
        },
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
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
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Asunto',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Mensaje',
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
    {
      name: 'readAt',
      type: 'date',
      label: 'Leído el',
      admin: {
        position: 'sidebar',
        description: 'Al guardar con esta fecha, el mensaje se archiva (solo queda registro con datos de contacto).',
      },
    },
    {
      name: 'readBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Leído por',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, originalDoc }) => {
        const orig = originalDoc as { readAt?: string | null } | undefined
        const next = { ...data } as Record<string, unknown>
        if (next.readAt && !orig?.readAt && req.user) {
          next.readBy = req.user.id
        }
        return next
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== 'update') return
        const prev = previousDoc as { readAt?: string | null } | undefined
        const d = doc as {
          id: number
          readAt?: string | null
          name: string
          phone: string
          email: string
          source?: string | null
        }
        if (!d.readAt || prev?.readAt) return

        const readAt =
          typeof d.readAt === 'string'
            ? d.readAt
            : d.readAt != null
              ? new Date(d.readAt as unknown as string).toISOString()
              : new Date().toISOString()

        await req.payload.create({
          collection: 'consultation-read-logs',
          data: {
            clientName: d.name,
            phone: d.phone,
            email: d.email,
            readAt,
            readBy: req.user?.id ?? undefined,
            source: d.source ?? undefined,
          },
          req,
          overrideAccess: true,
        })

        await req.payload.delete({
          collection: 'consultation-messages',
          id: d.id,
          req,
          overrideAccess: true,
        })
      },
    ],
  },
}
