import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import SvgIcon from '@material-ui/core/SvgIcon';
//img
import LogoDesk from '../../../assets/images/logotext.png';
//icons
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
//keys
import { AUTH_COOKIE } from '../../../config/keys';
//context
import { UserDataContext } from '../../../contexts/UserDataContext';
//types 
import { FETCH_USER_DATA } from '../../../reducers/userDataReducer'

const Navbar = (props) => {

    const { userDataDispatch } = useContext(UserDataContext);

    const logout = () => {
        Cookies.remove(AUTH_COOKIE);
        userDataDispatch({ type: FETCH_USER_DATA, payload: {} });
    }

    return (
        <nav className="navbar">
            <img src={LogoDesk} alt="shifter" className="navbar__logo" />
            <div className="navbar__cta">
                <SvgIcon
                    className="navbar__cta__icon"
                    component={SettingsOutlinedIcon}
                    onClick={props.toggleSettingsModal}
                />
                <SvgIcon
                    className="navbar__cta__icon"
                    component={ExitToAppIcon}
                    onClick={logout}
                />
            </div>
        </nav>
    )
}

export default Navbar;
