import { TestDefinition, TestProductCategory, TestProductName } from '../service/type/Test';

export const GetTestDefinition = (name: string): TestDefinition | undefined => {
    switch (name) {
        case TestProductName.FamilyPlanning:
        case TestProductName.UkFamilyPlanning:
        case TestProductName.TasscareFamilyPlanning:
        case TestProductName.ArtmedFamilyPlanning:
        case TestProductName.OgathFamilyPlanning:
        case TestProductName.BdmsthFamilyPlanning:
            return TestDefinition.FamilyPlanning;
        case TestProductName.Health:
        case TestProductName.UkHealth:
        case TestProductName.TasscareHealth:
        case TestProductName.ArtmedHealth:
        case TestProductName.OgathHealth:
        case TestProductName.BdmsthHealth:
            return TestDefinition.Health;
        case TestProductName.HealthPlus:
            return TestDefinition.HealthPlus;
        case TestProductName.Vital:
        case TestProductName.UkVital:
        case TestProductName.TasscareVital:
        case TestProductName.ArtmedVital:
        case TestProductName.OgathVital:
        case TestProductName.BdmsthVital:
            return TestDefinition.Vital;
        case TestProductName.VitalLite:
        case TestProductName.UkVitalLite:
            return TestDefinition.VitalLite;
        case TestProductName.Premium:
        case TestProductName.UkPremium:
        case TestProductName.TasscarePremium:
        case TestProductName.ArtmedPremium:
        case TestProductName.OgathPremium:
        case TestProductName.Bdmsthpremium:
            return TestDefinition.Premium;
        case TestProductName.HkSnapshotAntibody:
            return TestDefinition.Antibody;
        case TestProductName.UkSnapshotHeartHealth:
            return TestDefinition.HeartHealth;
        default:
            return undefined;
    }
};

export const GetTestProductCagetory = (currentProductName: string): TestProductCategory | undefined => {
    switch (currentProductName) {
        case TestProductName.FamilyPlanning:
        case TestProductName.Health:
        case TestProductName.HealthPlus:
        case TestProductName.Vital:
        case TestProductName.VitalLite:
        case TestProductName.Premium:
        case TestProductName.HkSnapshotAntibody:
            return TestProductCategory.Global;
        case TestProductName.ArtmedFamilyPlanning:
        case TestProductName.ArtmedHealth:
        case TestProductName.ArtmedVital:
        case TestProductName.ArtmedPremium:
            return TestProductCategory.Artmed;
        case TestProductName.OgathFamilyPlanning:
        case TestProductName.OgathHealth:
        case TestProductName.OgathVital:
        case TestProductName.OgathPremium:
            return TestProductCategory.Ogath;
        case TestProductName.UkFamilyPlanning:
        case TestProductName.UkHealth:
        case TestProductName.UkVital:
        case TestProductName.UkPremium:
            return TestProductCategory.Uk;
        case TestProductName.TasscareFamilyPlanning:
        case TestProductName.TasscareHealth:
        case TestProductName.TasscareVital:
        case TestProductName.TasscarePremium:
            return TestProductCategory.Tasscare;
        case TestProductName.BdmsthFamilyPlanning:
        case TestProductName.BdmsthHealth:
        case TestProductName.BdmsthVital:
        case TestProductName.Bdmsthpremium:
            return TestProductCategory.Bdmsth;
        default:
            return undefined;
    }
};

export const IsMaximal = (product: string): boolean => {
    return GetTestDefinition(product) === TestDefinition.Premium;
};
