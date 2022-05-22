export const allSettled = (promises: Promise<unknown>[]) => {
    return Promise.all(promises.map(promise => promise.then(value => ({ status: 'fulfilled', value })).catch(reason => ({ status: 'rejected', reason }))));
};
