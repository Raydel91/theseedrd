import type { GlobalConfig } from 'payload'

/**
 * Quién puede nombrar a los otros administradores (máx. 3 en total en `users`).
 * Se rellena al crear el primer usuario con `isAdmin: true`.
 */
export const AdminRegistry: GlobalConfig = {
  slug: 'admin-registry',
  label: 'Administración (sistema)',
  admin: {
    group: 'Sistema',
    description:
      'El primer administrador queda registrado aquí. Solo él puede asignar el rol de administrador a otras cuentas internas (hasta 3 admins en total, incluido él).',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.isAdmin || user?.isStaff),
    update: ({ req: { user } }) => user?.isAdmin === true,
  },
  fields: [
    {
      name: 'primaryAdmin',
      type: 'relationship',
      relationTo: 'users',
      maxDepth: 0,
      label: 'Administrador principal',
      admin: {
        readOnly: true,
        description: 'Definido automáticamente al crear el primer admin. Solo este usuario puede promover a otros admins.',
      },
    },
  ],
}
