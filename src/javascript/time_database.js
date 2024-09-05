import { supabase } from '../supabaseClient'

/**
 * Set the end_value of the timer and running to True
 *
 * @export
 * @param {*} loadId
 * @param {*} timeValue
 * @param {*} owner_id
 * @return {*}
 */
export async function setTimeAndStart(loadId, timeValue, owner_id) {
    console.log('setting time: ', timeValue)
    const { data, error } = await supabase
        .from('timer_track')
        .update({
            end_time: timeValue,
            running: true,
            owner: owner_id,
        })
        .eq('id', loadId)

    // console.log(error)
    return data
}

/**
 * Set running to false and empty to false
 * Do not set end_value
 *
 * @param {int} loadId
 * @returns
 */
export async function prepareNewTimer(loadId, owner_id, initialValue) {
    const { data, error } = await supabase
        .from('timer_track')
        .update({
            running: false,
            empty: false,
            owner: owner_id,
            initial_value: initialValue,
        })
        .eq('id', loadId)

    return data
}

/**
 * get the current game room data
 *
 * @export
 * @param {*} id
 * @param {*} successCallback
 * @param {*} errorCallback
 * @return {*}
 */
export async function getLoadData(id, errorCallback) {
    let { data: load, error } = await supabase
        .from('timer_track')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (errorCallback) {
            errorCallback(error)
        }
    }
    return load
}

/**
 * Set empty to true
 *
 * @param {int} id
 * @returns
 */
export async function emptyLoad(id) {
    const { data, error } = await supabase
        .from('timer_track')
        .update({ empty: true })
        .eq('id', id)

    return data
}

/**
 * Set end_time to 0
 *
 * @param {int} id
 * @returns
 */
export async function finishLoad(id) {
    const { data, error } = await supabase
        .from('timer_track')
        .update({ end_time: 0 })
        .eq('id', id)

    return data
}

export async function resetWasherState(id) {
    const { data, error } = await supabase
        .from('timer_track')
        .update({ running: true, empty: true, end_time: 0 })
        .eq('id', id)

    return data
}

/**
 * subscribe to a load session and listen for changes
 *
 * @export
 * @param {*} loadId
 * @param {*} changeCallback
 */
export function subscribeToRoom(changeCallback) {
    console.log('connecting to receive updates...')
    var timerTrack = supabase
        .channel('timer_track')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'timer_track',
            },
            (payload) => {
                changeCallback(payload['new'])
            }
        )
        .subscribe((status, e) => {
            console.log(status, e)
        })

    return timerTrack
}
