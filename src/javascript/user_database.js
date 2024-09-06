import { supabase } from '../supabaseClient'

/**
 * Get user name and surname, given the id
 */
export async function getUserName(id) {
	const { data, error } = await supabase
		.from('Users')
		.select('name, surname')
		.eq('id', id)

	return data
}

export async function getUserEmail(id) {
	const { data, error } = await supabase
		.from('Users')
		.select('email')
		.eq('id', id)

	return data
}