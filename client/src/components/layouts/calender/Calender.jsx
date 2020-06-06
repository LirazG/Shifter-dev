import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
//context
import { ShiftConfigurationContext } from '../../../contexts/ShiftConfigurationContext'
//components
import CalenderHeader from './parts/CalenderHeader';


//deployments of workers to shifts
const initialDeployments = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
];

const Calender = (props) => {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [weekShifts, setWeekShifts] = useState([]);
    const [deployments, setDeployments] = useState(initialDeployments);
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

    //ondrag action functionallity
    useEffect(() => {
        if (props.dndAction) {
            //use data passed by droppable id to set employee into place in deployments state
            //dndChangesData[0] - shift.id, dndChangesData[1] - day Index , dndChangesData[2] - shift index
            let dndChangesData = props.dndAction.destination.droppableId.split(',');
            let shiftId = dndChangesData[0];
            let dayIndex = dndChangesData[1];
            let shiftIndex = dndChangesData[2];

            console.log(dndChangesData)
            let newDeploymentsState = JSON.parse(JSON.stringify(deployments));
            newDeploymentsState[dayIndex].push({
                /*employee data here*/
                shiftId
            });
            setDeployments(newDeploymentsState)
        }
    }, [props.dndAction]);


    return (
        <div className="calender">
            <CalenderHeader selectedDate={selectedDate} changeCalenderData={setSelectedDate} />
            <section className="calender__week">
                {weekShifts.map((day, dayIndex) =>
                    <div className="calender__week__day" key={moment(day).format('dddd, DD')}>
                        <header className="calender__week__header">
                            {moment(day).format('dddd, DD')}
                        </header>
                        <section className="calender__week__shifts">
                            {shiftConfigs.map((shift, shiftIndex) =>
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
                                    <Droppable
                                        droppableId={`${shift._id},${dayIndex},${shiftIndex}`}
                                        key={`${shift._id},${dayIndex},${shiftIndex}`}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="calender__droppable"
                                            >
                                                {/* get data per day according to index in weekdays array */}
                                                {deployments[dayIndex].map((deploy, deployIndex) =>
                                                    // render only if in same shift
                                                    deploy.shiftId === shift._id ?
                                                        <Draggable draggableId={String(deployIndex)} index={deployIndex} key={'index' + deployIndex * 233}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={"employees-list__content__employee"}
                                                                >
                                                                    <h4>dsewewwddww</h4>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                        :
                                                        null
                                                )}
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
