import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin, isPortalClient } from '@/payload/access/user-helpers'

/** Expedientes / casos para el timeline del dashboard del cliente */
export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'caseStage', 'updatedAt'],
    description: 'Casos de relocalización vinculados al portal de clientes',
  },
  access: {
    read: ({ req: { user } }) => {
      if (canAccessPayloadAdmin(user as User)) return true
      if (user?.collection === 'users' && isPortalClient(user as User)) {
        return {
          portalUser: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    delete: ({ req: { user } }) => (user as User | undefined)?.isAdmin === true,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Nombre completo',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono / WhatsApp',
    },
    {
      name: 'portalUser',
      type: 'relationship',
      relationTo: 'users',
      label: 'Usuario del portal',
      admin: {
        description: 'Cliente que ve este expediente en /dashboard',
      },
    },
    {
      name: 'caseStage',
      type: 'select',
      label: 'Etapa del caso',
      defaultValue: 'intake',
      options: [
        { label: 'Recepción', value: 'intake' },
        { label: 'Documentación', value: 'documentation' },
        { label: 'Legal / residencia', value: 'legal' },
        { label: 'Vivienda', value: 'housing' },
        { label: 'Integración', value: 'integration' },
        { label: 'Completado', value: 'completed' },
      ],
    },
    {
      name: 'timeline',
      type: 'array',
      label: 'Hitos del caso',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Etiqueta',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: 'Detalle',
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
          label: 'Completado',
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
          label: 'Orden',
        },
      ],
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Notas internas',
      access: {
        read: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
      },
    },
  ],
}
