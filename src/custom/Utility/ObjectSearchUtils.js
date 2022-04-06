// Yields all objects in root that pass condition.
// DOES NOT yield nested valid objects. If an object matches the condition, its children are not checked. This is a small optimization for our Ego4D data.
export function* dfs_find(root, condition, path, key) {
    path = path ?? [];
    key = key ?? '';
    // Case 1: Root is null or undefined
    if (root === null || root === undefined) {
        return;
    }

    // If the root satisfies our conditions, yield it
    if (condition(root, path)) {
        yield ({ root, path, key });
        return;
    }

    // Then dfs it, looking for more

    // Case 2: Root is a single value
    else if (['string', 'number', 'boolean'].indexOf(typeof (root)) > -1) {
        return;
    }

    // Case 3: Root is an Object or Array
    else if (root.constructor === Object || root.constructor === Array) {
        for (let k of Object.keys(root)) {
            for (let i of dfs_find(root[k], condition, [...path, String(k)], k)) {
                yield i;
            }
        };
    }
}
