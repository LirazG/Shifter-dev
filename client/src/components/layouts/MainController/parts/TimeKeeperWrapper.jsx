import React, { useState, useRef } from 'react';
import Timekeeper from 'react-timekeeper';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SvgIcon from '@material-ui/core/SvgIcon';
//custom hooks
import { useOutsideClick } from '../../../../functions/customHooks';

const TimeKeeperWrapper = (props) => {

    const [activeTimeKeeper, setActiveTimeKeeper] = useState(false);
    const timekeeper = useRef();

    useOutsideClick(timekeeper, (e) => {
        setActiveTimeKeeper(false)
    });

    const toggleTimeKeeper = () => {
        setActiveTimeKeeper(prevState => {
            return !prevState
        });
    }

    const handleTimeChange = (name, time) => {
        props.onChange(name, time);
    }

    return (
        <span ref={timekeeper} className="shifts__wrapper__group__timekeeper--wrapper">
            <button id="time1" onClick={toggleTimeKeeper}>
                Set Time
                <SvgIcon component={ScheduleIcon} />
            </button>
            {activeTimeKeeper ?
                <div className="shifts__wrapper__group__timekeeper" >
                    <Timekeeper
                        time={props.value}
                        onChange={(newTime) => handleTimeChange(props.name, newTime.formatted24)}
                        onDoneClick={() => setActiveTimeKeeper(false)}
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

export default TimeKeeperWrapper
