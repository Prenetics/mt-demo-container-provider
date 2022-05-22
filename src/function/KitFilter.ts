import { GetTestDefinition } from '../helper/testing';
import { Kit } from '../service/type/Kit';
import { TestDefinition } from '../service/type/Test';

export const findLatestKit = (kits: Kit[], profileId?: string, definitions?: TestDefinition[]): Kit | undefined => {
    let kitsForSpecificProfile = kits;
    if (profileId) {
        if (definitions) {
            kitsForSpecificProfile = kits.filter(item => item.profile === profileId && definitions?.some(def => def === GetTestDefinition(item.test[0]?.name)));
        } else {
            kitsForSpecificProfile = kits.filter(item => item.profile === profileId);
        }
    }

    if (kitsForSpecificProfile.length === 0) return;

    const kitsWithLastActionTime = kitsForSpecificProfile.map(kit => {
        const history = [...kit.history];
        const historySortedInDesc = history.sort((a, b) => {
            return b.datetime.diff(a.datetime);
        });
        return {
            ...kit,
            latestActionTimeMoment: historySortedInDesc[0].datetime,
        };
    });

    const latestRecord = kitsWithLastActionTime.reduce((latest, current) => {
        if (!latest) {
            return current;
        }
        if (current.latestActionTimeMoment.isAfter(latest.latestActionTimeMoment)) {
            return current;
        }
        return latest;
    }, kitsWithLastActionTime[0]);

    return latestRecord;
};
