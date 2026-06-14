import {z} from 'zod'

export const localPrefsFieldsSchema = z.object({
  // Represents the path to the project directory on the user's local machine.
  // This is used when the user wants to open a project that is stored locally.
  localDirectoryPath: z.string(),
  // Represents the protocol used to launch the user's preferred IDE via a deep link.
  // This could be something like `vscode://` or `jetbrains://`, depending on the user's preference.
  editorLaunchProtocol: z
    .enum([
      'vscode://file/',
      'jetbrains://web-storm/navigate/reference?path=',
      'cursor://file/',
    ])
    .or(z.string())
    .default('vscode://file/'),
})

export type LocalPrefsFields = z.infer<typeof localPrefsFieldsSchema>
