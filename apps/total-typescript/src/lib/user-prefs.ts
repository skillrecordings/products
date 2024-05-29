import {z} from 'zod'
import {prisma} from '@skillrecordings/database'

const LOCAL_PREFS_TYPE = 'Local'

export const localPrefsFieldsSchema = z.object({
  // Represents the path to the project directory on the user's local machine.
  // This is used when the user wants to open a project that is stored locally.
  localDirectoryPath: z.string(),
  // Represents the protocol used to launch the user's preferred IDE via a deep link.
  // This could be something like `vscode://` or `jetbrains://`, depending on the user's preference.
  editorLaunchProtocol: z.string(),
})

type LocalPrefsFields = z.infer<typeof localPrefsFieldsSchema>

const userPrefsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.union([z.literal('Global'), z.literal('Local')]).default('Global'),
  fields: z.record(z.unknown()).or(z.unknown()).default({}),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
})

const localUserPrefsSchema = userPrefsSchema.extend({
  fields: z.record(localPrefsFieldsSchema),
  type: z.literal('Local'),
})

export type UserPrefs = z.infer<typeof userPrefsSchema>
export type LocalUserPrefs = z.infer<typeof localUserPrefsSchema>

export async function setLocalUserPrefs({
  resourceId,
  userId,
  fields,
}: {
  resourceId: string
  userId: string
  fields: LocalPrefsFields
}) {
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Fetch the user with their local preferences
  const userWithLocalPrefs = await prisma.user.findFirst({
    where: {
      id: userId,
      prefs: {
        every: {
          type: LOCAL_PREFS_TYPE,
        },
      },
    },
    include: {
      prefs: true,
    },
  })

  let localPrefs

  if (userWithLocalPrefs) {
    // If the user has local preferences, we prepare to update them
    const existingFields =
      typeof userWithLocalPrefs.prefs[0].fields === 'object'
        ? userWithLocalPrefs.prefs[0].fields
        : {}

    // Update the user's local preferences, spreading the existing fields
    // and adding or updating the field with the provided resourceId
    localPrefs = await prisma.userPrefs.update({
      where: {
        id: userWithLocalPrefs.prefs[0].id,
      },
      data: {
        fields: {
          ...existingFields,
          [resourceId]: {
            localDirectoryPath: fields.localDirectoryPath,
            editorLaunchProtocol: fields.editorLaunchProtocol,
          },
        },
        updatedAt: new Date(),
      },
    })
  } else {
    // If the user doesn't have local preferences, we create them
    // with the provided resourceId and fields
    localPrefs = await prisma.userPrefs.create({
      data: {
        userId: userId,
        type: LOCAL_PREFS_TYPE,
        fields: {
          [resourceId]: {
            localDirectoryPath: fields.localDirectoryPath,
            editorLaunchProtocol: fields.editorLaunchProtocol,
          },
        },
      },
    })
  }

  // Validate the updated or created local preferences against the schema
  const parsedLocalPrefs = localUserPrefsSchema.safeParse(localPrefs)

  if (!parsedLocalPrefs.success) {
    throw new Error('Invalid user prefs')
  }

  return parsedLocalPrefs.data
}

export async function getLocalUserPrefs({
  resourceId,
  userId,
}: {
  resourceId: string
  userId: string
}) {
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Fetch the user with their local dev environment preferences
  const userWithLocalPrefs = await prisma.user.findFirst({
    where: {
      id: userId,
      prefs: {
        every: {
          type: LOCAL_PREFS_TYPE,
        },
      },
    },
    include: {
      prefs: true,
    },
  })

  if (!userWithLocalPrefs) {
    return null
  }
  // Extract and validate the local preferences
  const localPrefs = userWithLocalPrefs.prefs[0]
  const parsedLocalPrefs = localUserPrefsSchema.safeParse(localPrefs)

  if (!parsedLocalPrefs.success) {
    throw new Error('Invalid user prefs', parsedLocalPrefs.error)
  }

  // Extract the local preferences for the provided resourceId
  const localUserPrefsForResource = parsedLocalPrefs.data.fields[resourceId]

  return localUserPrefsForResource
}
