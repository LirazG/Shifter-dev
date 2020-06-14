import React, { useState, useRef } from 'react';
import Timekeeper from 'react-timekeeper';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SvgIcon from '@material-ui/core/SvgIcon';
//custom hooks
import { useOutsideClick } from '../../../../functions/customHooks';

const TimeKeeperWrapper = (props) => {

    const [activeTimeKeeper, setActiveTimeKeeper] = useState(false);
    const [timekeeperValue, setTimekeeperValue] = useState({ name: props.name, value: props.value });
    const timekeeper = useRef();

    useOutsideClick(timekeeper, (e) => {
        setActiveTimeKeeper(false)
    });

    const toggleTimeKeeper = () => {
        setActiveTimeKeeper(prevState => {
            return !prevState
        });
    }

    const handleTimeChange = (name, value) => {
        setTimekeeperValue({ name, value });
    }

    const handleDoneClick = () => {
        props.onChange(timekeeperValue.name, timekeeperValue.value);
        setActiveTimeKeeper(false);
    }

    return (
        <span ref={timekeeper} className="shifts__wrapper__group__timekeeper--wrapper">
            <button id="time1" type="button" onClick={toggleTimeKeeper}>
                Set Time
                <SvgIcon component={ScheduleIcon} />
            </button>
            {activeTimeKeeper ?
                <div className="shifts__wrapper__group__timekeeper" >
                    <Timekeeper
                        time={timekeeperValue.value}
                        onChange={(newTime) => handleTimeChange(timekeeperValue.name, newTime.formatted24)}
                        onDoneClick={handleDoneClick}
                        hour24Mode
                        switchToMinuteOnHourSelect
                    />
                </div>
                :
                null
            }
        </span>
    )
}

export default TimeKeeperWrapper;
