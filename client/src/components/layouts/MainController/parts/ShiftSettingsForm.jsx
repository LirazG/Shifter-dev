import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
//components
import TimeKeeperWrapper from './TimeKeeperWrapper';
import ShiftHeader from './ShiftHeader';
import CustomInput from '../../../globals/formComponents/CustomInput';
import Spinner from '../../../globals/spinners/Spinner';
//context
import { UserDataContext } from '../../../../contexts/UserDataContext';
//icons
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
//api
import { generalGetRequest, generalPostRequest } from '../../../../functions/api';
//routes
import { FETCH_SHIFTS, UPDATE_SHIFTS } from '../../../../config/routes';

const ExpansionPanel = withStyles({
    root: {
        fontSize: '1.6rem',
        border: '1px solid rgba(59, 180, 151, 0.5)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: '#eef5f3',
        borderBottom: '1px solid rgba(59, 180, 151, 0.5)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

const ShiftSettingsForm = (props) => {
    const { userData } = useContext(UserDataContext);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState([]);

    //fetch shifts on mount
    useEffect(() => {
        (async () => {
            let shifts = await generalGetRequest(`${FETCH_SHIFTS}/?userId=${userData._id}`);
            if (shifts.status === 200)
                setShifts(shifts.data);
        })();
    }, []);

    const handleActiveMenu = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const addShift = () => {
        if (shifts.length >= 4)
            return
        let newShifts = shifts.map(shift => shift);
        newShifts.push(
            {
                name: `New Shift ${newShifts.length + 1}`,
                startTime: '',
                endTime: '',
                numberOfEmployees: null
            }
        );
        setShifts(newShifts);
    }

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let newShifts = await generalPostRequest(UPDATE_SHIFTS, { userId: userData._id, shifts }, 'put');
        if (newShifts.status === 200) {
            setShifts(newShifts.data);
            setLoading(false);
        }
    }

    const handleShiftChange = (index, name, value) => {
        let newShifts = shifts.map(shift => shift);
        newShifts[index][name] = value;
        setShifts(newShifts)
    }

    return (
        <form className="main-controller__settings--form" onSubmit={submit}>
            <h1>Daily shift arrangement</h1>
            <div className="main-controller__settings--form__shifts">
                {shifts.map((shift, shiftIndex) =>
                    <ExpansionPanel square expanded={expanded === `panel${shiftIndex}`} onChange={handleActiveMenu(`panel${shiftIndex}`)}>
                        <ExpansionPanelSummary aria-controls={`panel${shiftIndex}d-content`} id={`panel${shiftIndex}d-header`}>
                            <ShiftHeader name={shift.name} />
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className="shifts__wrapper">
                                <div className="shifts__wrapper__group">
                                    <p>Name:</p>
                                    <CustomInput
                                        value={shift.name}
                                        name="name"
                                        onChange={handleShiftChange.bind(null, shiftIndex)}
                                    />
                                </div>
                                <div className="shifts__wrapper__group">
                                    <span className="shifts__wrapper__group--50w">
                                        <p>Start time: {shift.startHour ? shift.startHour : '-'}</p>
                                        <TimeKeeperWrapper
                                            name="startHour"
                                            value={shift.startHour}
                                            onChange={handleShiftChange.bind(null, shiftIndex)}
                                        />
                                    </span>

                                    <span className="shifts__wrapper__group--50w">
                                        <p>End time: {shift.endHour ? shift.endHour : '-'}</p>
                                        <TimeKeeperWrapper
                                            name="endHour"
                                            value={shift.endHour}
                                            onChange={handleShiftChange.bind(null, shiftIndex)}
                                        />
                                    </span>
                                </div>
                                <div className="shifts__wrapper__group">
                                    <div className="shifts__wrapper__group--100w">
                                        <p>Number of employees per shift: </p>
                                        <div>
                                            <figure
                                                className="shifts__wrapper__group__figure"
                                                onClick={handleShiftChange.bind(null, shiftIndex, "numberOfEmployees", shift.numberOfEmployees ? shift.numberOfEmployees + 1 : 1)}
                                            >
                                                <SvgIcon
                                                    component={AddIcon}
                                                    className="shifts__wrapper__group__figure__icon"
                                                />
                                            </figure>
                                            <CustomInput
                                                type="number"
                                                name="numberOfEmployees"
                                                value={shift.numberOfEmployees}
                                                onChange={handleShiftChange.bind(null, shiftIndex)}
                                            />
                                            <figure
                                                className="shifts__wrapper__group__figure"
                                                onClick={handleShiftChange.bind(null, shiftIndex, "numberOfEmployees", shift.numberOfEmployees ? shift.numberOfEmployees - 1 : 1)}
                                            >
                                                <SvgIcon
                                                    component={RemoveIcon}
                                                    className="shifts__wrapper__group__figure__icon"
                                                />
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )}
            </div>

            <span className="main-controller__settings--form__add-shift" onClick={addShift}>
                <p>Add shift</p>
                <SvgIcon
                    component={AddIcon}
                />

            </span>

            <button type="submit" style={loading ? { pointerEvents: 'none', opacity: '0.6' } : {}}>
                {!loading ?
                    <span>Save Changes</span>
                    :
                    <Fragment>
                        <Spinner size={40} />
                        <span>Saving...</span>
                    </Fragment>
                }
            </button>
        </form>
    )
}

export default ShiftSettingsForm;
