import React from 'react';
import { Button, Input, InputWithIcon, Typography } from '@prenetics/prenetics-react-library';
import { useState } from 'react';
import colors from '../../theme/colors.module.scss';
import { ReactComponent as ShowLogo } from '../../asset/image/show.svg';
import './Login.scss';
import { useAuth } from '@prenetics/react-context-provider';

export const Login = () => {
    const { login } = useAuth();
    const [loading, isLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async () => {
        isLoading(true);
        try {
            const token = await login(username, password);
            if (token) localStorage.setItem('token', token);
        } catch (error) {
            console.log('error', error);
        }
        isLoading(false);
    };

    return (
        <div className="Login">
            <div className="container">
                <Typography text={'Login'} color={colors.B9} type="p1" weight="black" />
                <Input
                    id="email"
                    name="email"
                    onChange={e => setUsername(e.target.value)}
                    additionalsize="small"
                    labelcomponent={<Typography text={'Email'} color={colors.B7} type="p3" weight="regular" />}
                />
                <InputWithIcon
                    id="password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                    Icon={<ShowLogo id="show-password" className="show" onClick={() => setShowPassword(!showPassword)} />}
                    additionalsize="small"
                    label={'Password'}
                    labelcomponent={<Typography text={'Password'} color={colors.B7} type="p3" weight="regular" />}
                    type={showPassword ? 'text' : 'password'}
                />
                <Button onClick={onSubmit} label={'Login'} id="submit" type="submit" isLoading={loading} loadingColor={'#fff'} buttonType="plain" />
            </div>
        </div>
    );
};
