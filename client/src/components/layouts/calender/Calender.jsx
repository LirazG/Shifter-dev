import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Droppable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
//context
import { ShiftConfigurationContext } from '../../../contexts/ShiftConfigurationContext'
//components
import CalenderHeader from './parts/CalenderHeader';

const Calender = () => {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [weekShifts, setWeekShifts] = useState([]);
    const { shiftConfigs } = useContext(ShiftConfigurationContext);
    //generate week days array
    useEffect(() => {
        let weekShifts = [];
        let startOfWeek = moment(selectedDate).startOf('week');
        for (let i = 0; i < 7; i++) {
            weekShifts.push(
                moment(startOfWeek).add(i, 'days')
            )
        }
        setWeekShifts(weekShifts)
    }, [selectedDate]);
    // useEffect(() => {
    //     (async () => {
    //         let shifts = await generalGetRequest(`${FETCH_SHIFTS}/?userId=${userData._id}`);
    //         if (shifts.status === 200)
    //             setShifts(shifts.data);
    //     })();
    // }, []);

    return (
        <div className="calender">
            <CalenderHeader selectedDate={selectedDate} changeCalenderData={setSelectedDate} />
            <section className="calender__week">
                {weekShifts.map(day =>
                    <div className="calender__week__day" key={moment(day).format('dddd, DD')}>
                        <header className="calender__week__header">
                            {moment(day).format('dddd, DD')}
                        </header>
                        <section className="calender__week__shifts">
                            {shiftConfigs.map(shift =>
                                <div
                                    className="calender__week__shifts__container"
                                    style={{ height: `calc((100% - 4rem) / ${shiftConfigs.length})` }}
                                    key={shift._id}
                                >
                                    <header>
                                        <p>{shift.name}</p>
                                        <SvgIcon
                                            component={InfoOutlinedIcon}
                                        />
                                    </header>
                                    <Droppable droppableId={shift._id} key={shift._id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="calender__droppable"
                                            >

                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Calender
