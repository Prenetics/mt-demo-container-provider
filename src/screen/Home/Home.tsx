import React from 'react';
import { Button, Dropdown, DropDownItemProps, Typography } from '@prenetics/prenetics-react-library';
import { useAuth, useProfile } from '@prenetics/react-context-provider';
import { useKit } from '../../provider/KitProvider/KitProvider';
import { useReport } from '../../provider/ReportProvider/ReportProvider';
import colors from '../../theme/colors.module.scss';
import './Home.scss';

export const Home = () => {
    const { token, logout } = useAuth();
    const { currentProfile, setCurrentProfile, userProfiles } = useProfile();
    const { defaultDnaKit } = useKit();
    const { dnaReport } = useReport();

    return (
        <div className="Home">
            <div className="container">
                <Typography text={'Profile'} color={colors.B9} type="p1" weight="black" />
                <div className="dropdown">
                    <Dropdown
                        dropDownList={userProfiles?.map(profile => ({ value: profile.profileId, id: profile.profileId, name: `${profile.name.firstName} ${profile.name.lastName}` }))}
                        customDefaultValue={
                            currentProfile && {
                                id: currentProfile.profileId,
                                name: `${currentProfile.name.firstName} ${currentProfile.name.lastName}`,
                            }
                        }
                        onItemChange={item => {
                            const profileId = (item as DropDownItemProps).id;
                            const profile = userProfiles?.find(profile => profile.profileId === profileId);
                            if (profile) {
                                setCurrentProfile(profile);
                                localStorage.setItem('profileId', profile.profileId);
                            }
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
                <div style={{ margin: '1em' }}>
                    <Button
                        onClick={() => {
                            logout();
                            localStorage.removeItem('token');
                        }}
                        label={'Logout'}
                        style={{ margin: '1em' }}
                    />
                </div>
            </div>
        </div>
    );
};
