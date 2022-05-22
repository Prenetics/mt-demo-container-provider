import { Dropdown, DropDownItemProps, Typography } from '@prenetics/prenetics-react-library';
import { useAuth } from '../../provider/AuthProvider/AuthProvider';
import { useKit } from '../../provider/KitProvider/KitProvider';
import { useProfile } from '../../provider/ProfileProvider/ProfileProvider';
import { useReport } from '../../provider/ReportProvider/ReportProvider';
import colors from '../../theme/colors.module.scss';
import './Home.scss';

export const Home = () => {
    const { token } = useAuth();
    const { currentProfile, setCurrentProfile, profiles } = useProfile();
    const { defaultDnaKit } = useKit();
    const { dnaReport } = useReport();

    return (
        <div className="Home">
            <div className="container">
                <Typography text={'Profile'} color={colors.B9} type="p1" weight="black" />
                <div className='dropdown'>
                <Dropdown
                    dropDownList={profiles?.map(profile => ({ value: profile.profileId, id: profile.profileId, name: `${profile.name.firstName} ${profile.name.lastName}` }))}
                    customDefaultValue={
                        currentProfile && {
                            id: currentProfile.profileId,
                            name: `${currentProfile.name.firstName} ${currentProfile.name.lastName}`,
                        }
                    }
                    onItemChange={item => {
                        const profileId = (item as DropDownItemProps).id;
                        const profile = profiles?.find(profile => profile.profileId === profileId);
                        setCurrentProfile(profile);
                    }}
                    onCreateNewItem={() => undefined}
                    onClickArrow={() => undefined}
                />
                </div>
                <Typography text={`First Name: ${currentProfile?.name.firstName}`} color={colors.B7} type="p3" weight="regular" />
                <Typography text={`Last Name: ${currentProfile?.name.lastName}`} color={colors.B7} type="p3" weight="regular" />
                <br />
                <Typography text={'DNA Kit'} color={colors.B9} type="p1" weight="black" />
                <Typography text={`Barcode: ${defaultDnaKit?.barcode}`} color={colors.B7} type="p3" weight="regular" />
                <br />
                <Typography text={'DNA Report'} color={colors.B9} type="p1" weight="black" />
                <a
                    href={`https://testing-web.circledna.com/gt?path=${encodeURIComponent('https://front.global.test.api.circledna.com/report/' + dnaReport?.reportUrl)}&bearerToken=${token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Home
                </a>
                {/* {dnaReport?.sections.map(section => (
                    <>
                        <Typography text={`${section.title} ${section.subtitle}`} color={colors.B7} type="p3" weight="regular" />
                        {section.reports.map(report => (
                            <a id={report.reportName} href={`https://front.global.test.api.circledna.com/report/${report.reportUrl}`} target="_blank" rel="noreferrer" style={{ margin: 8 }}>{`${report.title}`}</a>
                        ))}
                    </>
                ))} */}
            </div>
        </div>
    );
};
