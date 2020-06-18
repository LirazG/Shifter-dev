import React, { Fragment, useState, useContext } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import SvgIcon from '@material-ui/core/SvgIcon';
//components
import TimeKeeperWrapper from './TimeKeeperWrapper';
import ShiftHeader from './ShiftHeader';
import CustomInput from '../../../globals/formComponents/CustomInput';
import Spinner from '../../../globals/spinners/Spinner';
//context
import { UserDataContext } from '../../../../contexts/UserDataContext';
import { ShiftConfigurationContext } from '../../../../contexts/ShiftConfigurationContext';
//types
import { SET_SHIFTS } from '../../../../reducers/shiftConfigurationReducer';
//icons
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
//api
import { generalPostRequest } from '../../../../functions/api';
//routes
import { UPDATE_SHIFTS } from '../../../../config/routes';

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
    const { shiftConfigs, shiftConfigsDispatch } = useContext(ShiftConfigurationContext);
    const [shiftConfigsLocalState, setShiftConfigsLocalState] = useState(shiftConfigs.map(shift => shift));

    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleActiveMenu = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const addShift = () => {
        if (shiftConfigsLocalState.length >= 4)
            return
        let newShifts = shiftConfigsLocalState.map(shift => shift);
        newShifts.push(
            {
                temporaryId: uuidv4(),
                name: `New Shift ${newShifts.length + 1}`,
                startTime: '',
                endTime: '',
                numberOfEmployees: null
            }
        );
        setShiftConfigsLocalState(newShifts);
    }

    const handleShiftChange = (index, name, value) => {
        //set default time if user opened timekeeper and did not change the hour but clicked on done
        if ((name === 'startHour' || name === 'endHour') && !value)
            value = '12:30'

        let newShifts = shiftConfigsLocalState.map(shift => shift);
        newShifts[index][name] = value;
        setShiftConfigsLocalState(newShifts);
    }

    const deleteShift = (indexToDelete) => {
        let newShifts = shiftConfigsLocalState.filter((shift, shiftIndex) => shiftIndex !== indexToDelete);
        setShiftConfigsLocalState(newShifts);
    }

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let newShifts = await generalPostRequest(UPDATE_SHIFTS, { userId: userData._id, shifts: shiftConfigsLocalState }, 'put');
        if (newShifts.status === 200) {
            setShiftConfigsLocalState(newShifts.data);
            shiftConfigsDispatch({ type: SET_SHIFTS, payload: newShifts.data });
            setLoading(false);
        } else {
            alert(JSON.stringify(newShifts.data.errors.map(err => err.msg)))
            setLoading(false);
        }
    }

    return (
        <form className="main-controller__settings--form" onSubmit={submit}>
            <h1>Daily shift arrangement</h1>
            <div className="main-controller__settings--form__shifts">
                {shiftConfigsLocalState && shiftConfigsLocalState.map((shift, shiftIndex) =>
                    <ExpansionPanel
                        key={shift._id || shift.temporaryId}
                        square
                        expanded={expanded === `panel${shiftIndex}`}
                        onChange={handleActiveMenu(`panel${shiftIndex}`)}
                    >
                        <ExpansionPanelSummary aria-controls={`panel${shiftIndex}d-content`} id={`panel${shiftIndex}d-header`}>
                            <ShiftHeader
                                name={shift.name}
                                shiftIndex={shiftIndex}
                                deleteShift={deleteShift}
                            />
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

            <span
                className="main-controller__settings--form__add-shift"
                onClick={addShift}
                style={shiftConfigsLocalState.length >= 4 ? { display: 'none' } : {}}
            >
                <p>Add shift (maximum 4)</p>
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
        </form >
    )
}

export default ShiftSettingsForm;
