import React, { useState, useEffect, useCallback, useContext } from 'react';
import moment from 'moment';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import SvgIcon from '@material-ui/core/SvgIcon';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
//context
import { ShiftConfigurationContext } from '../../../contexts/ShiftConfigurationContext';
import { UserDataContext } from '../../../contexts/UserDataContext';
//components
import CalenderHeader from './parts/CalenderHeader';
import ShiftHeader from './parts/ShiftHeader';
import Spinner from '../../globals/spinners/Spinner';
//functions
import { generalGetRequest } from '../../../functions/api';
//routes
import { FETCH_DEPLOYMENTS } from '../../../config/routes';

const initialDeployments = [[], [], [], [], [], [], []];

const Calender = (props) => {
    const selectedDate = props.selectedDate;
    const [selectedDateThrottleTimeout, setSelectedDateThrottleTimeout] = useState(null);
    const [weekShifts, setWeekShifts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { shiftConfigs } = useContext(ShiftConfigurationContext);
    const { userData } = useContext(UserDataContext);

    //generate week days array
    useEffect(() => {
        setLoading(true);
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
                    setLoading(false);
                    setWeekShifts(weekShifts);
                })();
            }, 800)
        );

    }, [selectedDate]);

    //get deployments from server
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
            props.setDeployments(newDeploymentsState);
        }
    }

    //determine if date in past
    let isPast = moment(selectedDate).startOf('week').valueOf() < moment().startOf('week').valueOf();

    return (
        <div className="calender">
            <CalenderHeader
                selectedDate={selectedDate}
                changeCalenderData={props.setSelectedDate}
                isPast={isPast}
            />
            <section className="calender__week">
                {isPast && !loading ?
                    <aside className="calender__week__past-curtain"></aside>
                    :
                    null
                }
                {loading ?
                    <aside className="calender__week__loader">
                        <Spinner size={80} color={'#28b498'} />
                    </aside>
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
                                    <ShiftHeader {...{ ...shift, totalShiftsNumber: shiftConfigs.length }} />
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
                                                {props.deployments[dayIndex].map((deploy, deployIndex) =>
                                                    // render only if in same shift
                                                    deploy.shiftId === shift._id ?
                                                        <Draggable draggableId={deploy._id} key={deploy._id} index={deployIndex}>
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
                                                                    <SvgIcon
                                                                        component={DragIndicatorIcon}
                                                                    />
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

export default React.memo(Calender);
