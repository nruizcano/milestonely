import { supabase } from '../supabaseClient'
import { GenericService } from './GenericService'

import { User } from '../../models/User'

import localDefaultPfp from '@/assets/icons/defaultPfp.png'

const pfpBucketName = import.meta.env.VITE_AVATARS_BUCKET_NAME
const defaultPfpFileName = import.meta.env.VITE_DEFAULT_AVATAR_FILE_NAME

export class UserService extends GenericService<User> {
  private static _instance: UserService

  private constructor() {
    super('users')
  }

  public static get instance(): UserService {
    if (!this._instance) {
      this._instance = new UserService()
    }
    return this._instance
  }

  public async getThisUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser()

    if (error) throw new Error(error.message)
    if (!data.user) return null

    const userMetadata = data.user.user_metadata

    const currUser = new User(data.user.id, userMetadata.first_name, userMetadata.last_name, data.user.email as string, userMetadata.phone_number, userMetadata.job_title, userMetadata.status)
    return currUser
  }

  public async getByEmailOrName(info: string): Promise<User[]> {
    const { data, error } = await this.supabaseQuery()
      .select()
      .ilike('email', info)
      .or(`email.ilike.%${info}%,first_name.ilike.%${info}%,last_name.ilike.%${info}%`)
    if (error) throw new Error(error.message)
    return data || []
  }

  public async searchUser(info: string): Promise<User[]> {
    const { data, error } = await this.supabaseQuery()
      .select()
      .or(
        `email.ilike.%${info}%,first_name.ilike.%${info}%,last_name.ilike.%${info}%`
      );
    if (error) throw new Error(error.message);
    return data || [];
  }

  public async sendPasswordResetLink(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }

  public async uploadPfp(file: File, userId: string): Promise<void> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${new Date().toISOString()}-${userId}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error } = await supabase.storage.from(pfpBucketName).upload(filePath, file)

    if (error) throw new Error(error.message)
  }

  public async getUserPfp(userId: string): Promise<string> {
    const { data: userFiles, error } = await supabase.storage.from(pfpBucketName).list(userId)

    if (error) throw new Error(error.message)

    const numFiles = userFiles.length

    if (!userFiles || numFiles === 0 || userFiles[0].name === '.emptyFolderPlaceholder') {
      const { data: rootFiles } = await supabase.storage.from(pfpBucketName).list()

      if (!rootFiles || rootFiles[0].name === '.emptyFolderPlaceholder') return localDefaultPfp

      const defaultPfpFile = rootFiles.find((file) => file.name === defaultPfpFileName)
      const fileName = defaultPfpFile?.name

      if (!fileName) return localDefaultPfp

      const { data } = supabase.storage.from(pfpBucketName).getPublicUrl(fileName)

      return data?.publicUrl ?? localDefaultPfp
    }

    const filePath = `/${userId}/${userFiles[numFiles - 1].name}`

    const { data: url } = await supabase.storage.from(pfpBucketName).getPublicUrl(filePath)

    return url.publicUrl
  }
}
