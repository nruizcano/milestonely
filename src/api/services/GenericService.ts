import { supabase } from '../supabaseClient'

export class GenericService<T> {
    protected readonly table: string
    protected readonly schema: string

    constructor(table: string) {
        this.table = table
        this.schema = 'public'
    }

    async create(item: T): Promise<T | null> {
        const { data, error } = await this.supabaseQuery()
            .insert(item)
            .single()
        if (error) throw new Error(error.message)
        return data
    }

    async getAll(): Promise<T[]> {
        const { data, error } = await this.supabaseQuery()
            .select()
        if (error) throw new Error(error.message)
        return data || []
    }

    async getById(id: string): Promise<T | null> {
        const { data, error } = await this.supabaseQuery()
            .select()
            .eq('id', id)
            .single()
        if (error) throw new Error(error.message)
        return data
    }

    async update(item: Partial<T>, id: string): Promise<T | null> {
        const { data, error } = await this.supabaseQuery()
            .update(item)
            .eq('id', id)
            .single()
        if (error) throw new Error(error.message)
        return data
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabaseQuery()
            .delete()
            .eq('id', id)
        if (error) throw new Error(error.message)
    }

    protected supabaseQuery() {
        return supabase.from(this.table)
    }
}
