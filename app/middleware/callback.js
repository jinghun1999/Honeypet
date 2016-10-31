/**
 * Created by User on 2016-10-26.
 */
export default function callback() {
    return next => action => {
        const { meta = {}, error, payload } = action;
        const { sequence = {}, resolved, rejected } = meta;
        if (sequence.type !== 'next') return next(action);

        error ? (rejected && rejected(payload)) : (resolved && resolved(payload));

        next(action);
    }
}