import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
//context
import { ShiftConfigurationContext } from '../../../contexts/ShiftConfigurationContext';
import { UserDataContext } from '../../../contexts/UserDataContext';
//components
import CalenderHeader from './parts/CalenderHeader';
//functions
import { generalPostRequest, generalGetRequest } from '../../../functions/api';
import { throttling } from '../../../functions/general';
//routes
import { DEPLOY, FETCH_DEPLOYMENTS } from '../../../config/routes';

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
    const [selectedDateThrottleTimeout, setSelectedDateThrottleTimeout] = useState(null);
    const [weekShifts, setWeekShifts] = useState([]);
    const [deployments, setDeployments] = useState(initialDeployments);
    const { shiftConfigs } = useContext(ShiftConfigurationContext);
    const { userData } = useContext(UserDataContext);

    //generate week days array
    useEffect(() => {
        //throttle data fetching from server
        setSelectedDateThrottleTimeout(
            clearTimeout(selectedDateThrottleTimeout)
        );

        setSelectedDateThrottleTimeout(
            setTimeout(() => {
                (async () => {
                    let weekShifts = [];
                    let startOfWeek = moment(selectedDate).startOf('week');
                    for (let i = 0; i < 7; i++) {
                        weekShifts.push(
                            moment(startOfWeek).add(i, 'days')
                        )
                    }
                    //fetch deployments
                    await fetchData();
                    setWeekShifts(weekShifts);
                })();
            }, 1000)
        );

    }, [selectedDate]);


    //ondrag action functionallity
    useEffect(() => {
        (async () => {
            if (props.dndAction) {
                //use data passed by droppable id to set employee into place in deployments state
                // dndChangesData[0] - shift.id,
                // dndChangesData[1] - day Index ,
                // dndChangesData[2] - shift index
                let dndChangesData = props.dndAction.destination.droppableId.split(',');
                let shiftId = dndChangesData[0];
                let dayIndex = dndChangesData[1];
                let shiftIndex = dndChangesData[2];
                //send deployment to server
                let body = {
                    userId: userData._id,
                    deployDate: moment(selectedDate).add(dayIndex, 'days').toISOString(),
                    employee: props.dndAction.draggableId,
                    shiftId
                }
                let newDeploy = await generalPostRequest(DEPLOY, body);
                let newDeploymentsState = JSON.parse(JSON.stringify(deployments));

                newDeploymentsState[dayIndex].push(newDeploy.data);
                setDeployments(newDeploymentsState);
            }
        })();
    }, [props.dndAction]);


    const fetchData = async () => {
        let startDate = moment(selectedDate).startOf('day').toISOString();
        let endDate = moment(selectedDate).add(7, 'days').startOf('day').toISOString();
        let deployments = await generalGetRequest(
            `${FETCH_DEPLOYMENTS}/?userId=${userData._id}&startDate=${startDate}&endDate=${endDate}`
        );
        if (deployments.status === 200) {
            let newDeploymentsState = JSON.parse(JSON.stringify(initialDeployments));

            deployments.data.map(deploy => {
                let diff = moment(endDate).diff(moment(deploy.deployDate), 'days');
                newDeploymentsState[6 - diff].push(deploy)
            });
            setDeployments(newDeploymentsState);
        }
    }

    let isPast = moment(selectedDate).startOf('week').valueOf() < moment().startOf('week').valueOf();

    return (
        <div className="calender">
            <CalenderHeader
                selectedDate={selectedDate}
                changeCalenderData={setSelectedDate}
                isPast={isPast}
            />
            <section className="calender__week">
                {isPast ?
                    <aside className="calender__week__past-curtain"></aside>
                    :
                    null
                }
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
                                        isDropDisabled={isPast}
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
                                                        <Draggable draggableId={deploy._id} index={deployIndex} key={deploy._id}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={"employees-list__content__employee"}
                                                                >
                                                                    <div>
                                                                        <h4>{deploy.employee.fullName}</h4>
                                                                        <h4>{deploy.employee.title ? deploy.employee.title : null}</h4>
                                                                    </div>
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
